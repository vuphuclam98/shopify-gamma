import { signal } from '@preact/signals'

function appState() {
  const productState = window.productState
  const currentVariant = signal(productState.initVariant)
  const productData = signal(null)
  const properties = signal({})

  function setCurrentVariant(variant) {
    if (currentVariant.value.id !== variant.id) {
      currentVariant.value = variant
    }
  }

  function setProductData(data) {
    productData.value = data
  }

  function setProperties(data) {
    properties.value = data
  }

  return {
    currentVariant,
    setCurrentVariant,
    productData,
    setProductData,
    properties,
    setProperties
  }
}

export default appState
