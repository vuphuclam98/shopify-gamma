import { useEffect, useState } from 'preact/hooks'
import {
  updateCartItem,
  removeCartItem,
  updateCart,
  getCartBadges,
  getCartInfo,
  getCartProperties,
  getDisableChangeQuantity,
  getMaxQuantity,
  removeBundlesItem,
  changeQuantityBundlesProduct
} from 'helpers/cart'
import { getProductTitle } from 'uses/useShopify'
import Image from 'snippets/image/image'
import QuantityInput from 'snippets/quantity-input/quantity-input'
import CartInfo from 'snippets/cart-info/cart-info'
import Badge from 'snippets/badge/badge'
import Price from 'snippets/price/price'

function CartItem({ item, setCart, setFetching, showQuantitySelector = true, additionalClassesParent = '' }) {
  const [quantity, setQuantity] = useState(item.quantity)

  const badges = getCartBadges(item.tags, item.properties)

  const infos = getCartInfo(item)

  const properties = getCartProperties(item.properties)

  const disableChangeQuantity = getDisableChangeQuantity(properties)

  const productTitle = getProductTitle(item.product_title)

  const maxQuantity = getMaxQuantity(item)

  const isBundles = false

  const onRemove = async () => {
    setFetching(true)
    if (!isBundles) {
      await removeCartItem(item.key)
    } else {
      await removeBundlesItem(item)
    }
    const newCart = await updateCart()
    setCart(newCart)
    setFetching(false)
  }

  const onChangeQuantity = async (quantity) => {
    setFetching(true)
    if (!isBundles) {
      await updateCartItem(item.key, quantity)
    } else {
      await changeQuantityBundlesProduct(item, quantity)
    }
    const newCart = await updateCart()
    setCart(newCart)
    setFetching(false)
  }

  useEffect(() => {
    if (item.quantity !== quantity) {
      onChangeQuantity(quantity)
    }
  }, [quantity])

  return (
    <div
      className={`mb-4 grid grid-cols-[106px_1fr_1fr] items-center gap-4 rounded border border-default p-4 first:mt-4 md:mb-6 md:grid-cols-[96px_1fr_106px_90px_75px] md:gap-6 md:p-6 md:first:mt-6 ${additionalClassesParent}`}
    >
      <div className="self-start">
        <Image imageUrl={[item.featured_image.url]} className="aspect-[1/1]" key={item.id} />
      </div>
      <div className="col-span-2 flex flex-col self-start text-sm text-grey-900 md:col-span-1 md:self-center md-max:my-auto">
        <a href={item.url} title={item.title}>
          {productTitle}
        </a>
        <CartInfo infos={infos} properties={properties} isGiftCard={item.gift_card || item.product_type === 'Gift card'} />
        <Badge items={badges} className="mt-2.5 flex gap-2" />
      </div>
      {showQuantitySelector ? (
        <div>
          <QuantityInput
            key={`${item.id}-${item.quantity}-${isBundles ? quantity : 'normal'}`}
            quantity={item.quantity}
            min="0"
            max={maxQuantity}
            setQuantity={setQuantity}
            disabled={disableChangeQuantity}
          />
        </div>
      ) : (
        <div />
      )}
      <div className="order-1 text-right md:order-none">
        <Price price={item.line_price} originalPrice={item.compare_at_price} className="flex flex-col" />
      </div>
      <div className="md:text-right">
        <button type="button" className="link text-sm text-grey-500" onClick={onRemove}>
          Remove
        </button>
      </div>
    </div>
  )
}

export default CartItem
