import { setRecentlyProducts } from 'uses/useRecentlyProduct'
import register from 'preact-custom-element'
import ProductInfo from 'snippets/product-info/product-info'
import ProductForm from 'snippets/product-form/product-form'
import ProductBadge from 'snippets/product-badge/product-badge'
import AnchorSection from 'snippets/anchor-section/anchor-section'

let devtools
if (process.env.NODE_ENV === 'development') {
  devtools = require('preact/devtools')
}

class ProductMain extends HTMLElement {
  constructor() {
    super()
    setRecentlyProducts(this.dataset.handle)

    if (localStorage.getItem('return_to')) {
      localStorage.removeItem('return_to')
    }
  }
}

register(ProductInfo, 'product-info')
register(ProductForm, 'product-form')
register(ProductBadge, 'product-badge')
register(AnchorSection, 'anchor-section')

customElements.define('product-main', ProductMain)
