import { computed, signal } from '@preact/signals'

function appState() {
  const cart = signal(GM_STATE.cart.initCart)
  const fetching = signal(false)

  function setCart(newCart) {
    cart.value = newCart
  }

  function setFetching(status) {
    fetching.value = status
  }

  const hasAgeVerification = computed(() => {
    return cart.value.items.some((item) => item.tags.includes('age-verification') || item.tags.includes('type-Alcohol'))
  })

  return {
    cart,
    setCart,
    fetching,
    setFetching,
    hasAgeVerification
  }
}

export default appState
