import { select, selectAll } from 'helpers/dom'
import { getProductTitle, getProductSubtitle } from 'uses/useShopify'
import { fetchData } from 'helpers/global'
import './wishlist-page.css'

const selectors = {
  wishlistContainerId: '#wishlist-items-container',
  removeWishlistButton: '.js-remove-wishlist-button'
}

const productCardMarkup = `<div class="swym-wishlist-grid grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 md:gap-x-8 md:gap-y-6">
    {{#products}}
      <div class="flex-col flex relative">
        <a href="{{du}}?variant={{epi}}" class="block w-full h-full basis-0">
          <img alt="" class="w-full h-full object-cover aspect-[1/1]" src="{{iu}}">
        </a>
        <button class="absolute top-2 right-2 w-8 h-8 z-[1] js-remove-wishlist-button" aria-label="Delete" data-variant-id="{{epi}}" data-product-id="{{empi}}">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32">
            <rect width="32" height="32" fill="#F6F6F6" rx="16"/>
            <path stroke="gray" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21.333 21.333 10.667 10.667M21.333 10.667 10.667 21.333"/>
          </svg>
        </button>
        <a href="{{du}}?variant={{epi}}" class="text-sm font-bold tracking-normal md:text-base mt-4 mb-auto block">
          {{variantTitle}}
        </a>
        <p class="block text-grey-500 mt-1.5 font-normal text-xs md:text-sm leading-[18px]">
          {{variantInfo}}
        </p>
        <div class="text-grey-900 text-sm leading-5 md:text-base mt-4">
          \${{pr}}
        </div>
        <a href="{{du}}?variant={{epi}}" class="button-outlined w-full mt-3 block py-2.5 min-h-[42px]">
          View detail
        </a>
      </div>
    {{/products}}
  </div>
  {{^products}}
    <div class="border-default border-dashed rounded border-2 p-8 md:p-16 flex flex-col items-center justify-center">
      <p class="max-w-[496px] text-center text-sm tracking-normal">
        Add to you wishlist!<br>
        Save all of your flavourful favourites here. Log in to view your wishlist items, curate them, and sync them seamlessly across all devices.
      </p>
      <a href="/" class="button-outlined w-fit mt-6 block">
        Continue shopping
      </a>
    </div>
  {{/products}}
  `

if (!window.SwymCallbacks) {
  window.SwymCallbacks = []
}
window.SwymCallbacks.push(swymRenderWishlist)

function swymRenderWishlist(swat) {
  swat.fetch(function (products) {
    const wishlistContentsContainer = select(selectors.wishlistContainerId)
    const formattedWishlistedProducts = Promise.all(
      products.map(function (p) {
        return new Promise((resolve) => {
          fetchData(`/products/${p.du.split('products/')[1]}?view=ajax`).then((product) => {
            p = SwymUtils.formatProductPrice(p)
            p.variantTitle = getProductTitle(product.title)
            p.variantInfo = getProductSubtitle(p.dt)
            resolve(p)
          })
        })
      })
    )

    formattedWishlistedProducts.then((data) => {
      const productCardsMarkup = SwymUtils.renderTemplateString(productCardMarkup, {
        products: data
      })
      if (wishlistContentsContainer) {
        wishlistContentsContainer.innerHTML = productCardsMarkup
        attachClickListeners()
      }
    })
  })
}

function attachClickListeners() {
  const removeButtons = selectAll(selectors.removeWishlistButton)
  for (let k = 0; k < removeButtons.length; k++) {
    removeButtons[k].addEventListener('click', onRemoveButtonClick, false)
  }
}

function onRemoveButtonClick(e) {
  e.preventDefault()
  const epi = +e.currentTarget.getAttribute('data-variant-id')
  const empi = +e.currentTarget.getAttribute('data-product-id')
  window._swat.fetch(function (products) {
    products.forEach(function (product) {
      if (epi && empi && product.epi === epi && product.empi === empi) {
        window._swat.removeFromWishList(product, function () {
          if (!window.SwymCallbacks) {
            window.SwymCallbacks = []
          }
          window.SwymCallbacks.push(swymRenderWishlist)
        })
      }
    })
  })
}
