/* global globalEvents */
import { fetchData, eventProps, postData } from 'helpers/global'
import { addClass, select, selectAll, removeClass } from 'helpers/dom'
import { hasOwnProperties } from 'helpers/utils'
import { getProductSubtitle, getCustomBadgeClass } from 'uses/useShopify'

const selectors = {
  cartCount: '#CartCount',
  SECTION_STORAGE_AGE_VERIFICATION: 'age-verification',
  MINI_CART_CONTENT_CLASS: '.js-mini-cart-content'
}

const settings = window.GM_STATE

const customBadgeTags = settings?.customs?.badge.tags || []
const customBadgeItems = settings?.customs?.badge.items || []

const getNativeCart = () => {
  return fetch('/cart.js')
    .then((res) => res.json())
    .then((data) => data)
}

const getCart = () => {
  return fetchData('/cart?view=ajax').then((cart) => {
    globalEvents.emit(eventProps.cart.count, cart.count)
    return cart
  })
}

const getLineItem = (id, properties, quantity) => {
  const data = {
    items: [
      {
        id,
        properties,
        quantity
      }
    ]
  }
  return data
}

const addCartItem = (id, properties = {}, quantity = 1) => {
  const lineItem = getLineItem(id, properties, quantity)
  return postData('/cart/add.js', lineItem, 'json', async (response) => {
    const { description } = await response.json()
    globalEvents.emit(eventProps.notice.global, {
      type: 'error',
      content: description
    })
  }).then((item) => {
    return item
  })
}

const addMutipleCartItems = (items) => {
  return postData('/cart/add.js', items, 'json', async (response) => {
    const { description } = await response.json()
    globalEvents.emit(eventProps.notice.global, {
      type: 'error',
      content: description
    })
  }).then((items) => {
    return items
  })
}

const updateMutipleCartItems = (items) => {
  return postData('/cart/update.js', items, 'json', async (response) => {
    const { description } = await response.json()
    globalEvents.emit(eventProps.notice.global, {
      type: 'error',
      content: description
    })
  }).then((items) => {
    return items
  })
}

const updateCartItem = (id, quantity) => {
  return postData('/cart/change.js', {
    id,
    quantity
  }).then((cart) => {
    globalEvents.emit(eventProps.cart.change, cart.item_count)
    return cart
  })
}

const changeQuantity = (id, quantity) => {
  return postData('/cart/change.js', {
    id,
    quantity
  }).then((cart) => {
    return cart
  })
}

const removeCartItem = (id) => {
  return postData('/cart/change.js', {
    id,
    quantity: 0
  }).then((cart) => {
    globalEvents.emit(eventProps.cart.change, cart.item_count)
    return cart
  })
}

const clearCart = () => {
  return postData('/cart/clear.js').then((cart) => {
    globalEvents.emit(eventProps.cart.clear, cart)
    return cart
  })
}

const reRenderCartCount = (count) => {
  const els = selectAll(selectors.cartCount, document.body)

  if (els) {
    if (count === 0) {
      els.forEach((el) => addClass('hidden', el))
    } else {
      els.forEach((el) => {
        el.innerText = count
        removeClass('hidden', el)
        addClass('flex', el)
      })
    }
  }
}

const updateCart = async () => {
  const newCart = await getCart()
  reRenderCartCount(newCart.item_count)
  return newCart
}

const forceReloadItem = async (item) => {
  const currentQty = item.quantity
  const nextQty = item.quantity + 1
  await changeQuantity(item.key, nextQty)
  const cart = await changeQuantity(item.key, currentQty)
  return cart
}

const openMiniCart = () => {
  const el = select('cart-slideout modal-dialog', document.body)
  if (el) {
    el.show()
    const contentEl = select(selectors.MINI_CART_CONTENT_CLASS, el)
    if (contentEl) {
      contentEl.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    }
  }
}

const getCartBadges = (tags, properties) => {
  const items = []

  if (!tags.length && !properties) {
    return items
  }

  if (tags.length) {
    for (const tag of tags) {
      const index = customBadgeTags.findIndex((i) => !tag.includes('preorder') && tag === i)
      if (index !== -1 && !customBadgeItems[index].hideOnCart) {
        items.push(customBadgeItems[index])
      } else {
        if (tag.includes('label-')) {
          const tagName = tag.replace('label-', '')
          items.push({
            text: tagName,
            tag,
            customClass: getCustomBadgeClass(tagName),
            backgroundColor: '',
            textColor: ''
          })
        }
      }
    }
  }

  return items.filter((item) => item)
}

const getCartInfo = (item) => {
  const arrs = []
  if (item.product_title) {
    arrs.push({
      name: getProductSubtitle(item.product_title),
      key: null
    })
  }
  return arrs
}

const getCartProperties = (items) => {
  const arrs = []
  if (items && Object.keys(items).length > 0) {
    for (const [key, value] of Object.entries(items)) {
      arrs.push({
        name: key,
        key: value
      })
    }
  }
  return arrs
}

const getDisableChangeQuantity = (properties) => {
  return false
}

const getItemsByKey = (items, item, key) =>
  items.filter((cartItem) => cartItem.properties && hasOwnProperties(key, cartItem.properties) && cartItem.properties.timestamp === item.properties.timestamp)

const getMaxQuantity = (cartItem) => {
  return cartItem.inventory_management === 'shopify' && cartItem.inventory_policy === 'deny' && cartItem.inventory_quantity > 0
    ? cartItem.inventory_quantity
    : 1000
}

const removeBundlesItem = async (item) => {
  const newCart = await updateCart()
  const bundleItems = getItemsByKey(newCart.items, item, 'timestamp')
  if (bundleItems.length === 0) {
    return
  }
  const newUpdates = {}
  for (const itemCart of bundleItems) {
    newUpdates[itemCart.id] = 0
  }
  const body = {
    updates: newUpdates
  }
  await updateMutipleCartItems(body)
}

const changeQuantityBundlesProduct = async (item, quantity) => {
  if (quantity === 0) {
    await removeBundlesItem(item)
    return
  }

  const newCart = await updateCart()
  const getBundleItems = getItemsByKey(newCart.items, item, 'timestamp')

  if (getBundleItems.length === 0) {
    return
  }

  const bundleItems = getBundleItems.reverse()
  const newTimestamp = Date.now()
  const body = {
    items: bundleItems.map((i) => {
      const newProperties = i.properties
      newProperties.timestamp = newTimestamp
      return {
        id: i.id,
        quantity: i.quantity,
        properties: newProperties
      }
    })
  }
  await addMutipleCartItems(body)
}

export {
  getNativeCart,
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
  updateCart,
  openMiniCart,
  getCartBadges,
  getCartInfo,
  getCartProperties,
  addMutipleCartItems,
  getDisableChangeQuantity,
  forceReloadItem,
  updateMutipleCartItems,
  getItemsByKey,
  getMaxQuantity,
  removeBundlesItem,
  changeQuantityBundlesProduct,
  reRenderCartCount
}
