import { useState } from 'preact/hooks'
import { eventProps } from 'helpers/global'
import { getProductSubtitle } from 'uses/useShopify'
import Price from 'snippets/price/price'

function ProductInfo() {
  const [currentVariant, setCurrentVariant] = useState(window.productState.initVariant)
  const currentProduct = window.productState.initProduct

  globalEvents.on(eventProps.product.updateVariant, (value) => {
    setCurrentVariant(value)
  })

  return (
    <div>
      <h1 class="h4 mb-1 pr-8 md:text-3xl">{currentProduct.title}</h1>
      <span className="text-base text-grey-500 [.gift-card_&]:hidden">{getProductSubtitle(currentProduct.title)}</span>
      <Price
        className="mt-4 flex flex-row-reverse justify-end text-grey-900"
        classSize="text-2xl md:text-3xl mr-2"
        price={currentVariant.price}
        originalPrice={currentVariant.compare_at_price}
      />
    </div>
  )
}

export default ProductInfo
