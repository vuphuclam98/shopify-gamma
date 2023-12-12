import appState from './@store'
import { fetchData } from 'helpers/global'
import { createContext } from 'preact'
import { useContext, useEffect, useMemo } from 'preact/hooks'
import ProductVariant from 'snippets/product-variant/product-variant'
import ProductATC from 'snippets/product-atc/product-atc'
import ProductStatus from 'snippets/product-status/product-status'
import ProductGiftCardForm from './product-giftcard-form'

const AppState = createContext()

function ProductForm() {
  return (
    <AppState.Provider value={appState()}>
      <App />
    </AppState.Provider>
  )
}

function App() {
  const state = useContext(AppState)
  const productState = window.productState
  const isGiftCard = productState.isGiftCard
  const productData = useMemo(() => state.productData.value, [state.productData.value])
  const variantSelectorType = !isGiftCard ? 'button' : 'dropdown'
  const className = !isGiftCard ? 'pt-1 border-t border-default js-product-form' : 'mt-1 js-product-form'

  const getProductData = async () => {
    const endpoint = `/products/${productState.initProduct.handle}?view=ajax`
    const data = await fetchData(endpoint)
    if (data) {
      state.setProductData(data)
    }
  }

  const renderButton = () => {
    return <ProductATC state={state} isGiftCard={productState.isGiftCard} buttonText="Add to cart" />
  }

  useEffect(() => {
    getProductData()
  }, [])

  return (
    <div className={className}>
      <ProductVariant
        variants={productState.initProduct.variants}
        options={productState.initProduct.options}
        state={state}
        productData={productData}
        initVariant={window.productState.initVariant}
        updateUrl="true"
        displayType={variantSelectorType}
      />
      {isGiftCard && <ProductGiftCardForm state={state} />}
      {productData ? (
        <ProductStatus
          id={state.currentVariant.value.id}
          tags={productState.initProduct.tags}
          available={state.currentVariant.value.available}
          productData={productData}
          afterpayEnable={window.productState.afterpayEnable || false}
          isGiftCard={isGiftCard}
        />
      ) : (
        isGiftCard && <ProductStatus available={state.currentVariant.value.available} afterpayEnable={window.productState.afterpayEnable || false} />
      )}
      {renderButton()}
    </div>
  )
}

export default ProductForm
