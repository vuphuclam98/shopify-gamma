import { select, addClass, removeClass } from 'helpers/dom'

const selectors = {
  WISHLIST_COUNT_SELECTOR: '.js-wishlist-count',
  HIDDEN_CLASS: 'opacity-0'
}

export default class WishlistCount extends HTMLElement {
  constructor() {
    super()
    this.wishlistCount = select(selectors.WISHLIST_COUNT_SELECTOR, this)
    const swymCallbackFn = () => {
      window._swat.fetch(() => {
        this.renderCount()
      })
    }
    if (!window.SwymCallbacks) {
      window.SwymCallbacks = []
    }
    window.SwymCallbacks.push(swymCallbackFn)
  }

  renderCount() {
    window._swat.renderWishlistCount(this.wishlistCount, function (count, element) {
      if (count > 0) {
        removeClass(selectors.HIDDEN_CLASS, element)
      } else {
        addClass(selectors.HIDDEN_CLASS, element)
      }
    })
  }
}

if (!customElements.get('wishlist-count')) {
  customElements.define('wishlist-count', WishlistCount)
}
