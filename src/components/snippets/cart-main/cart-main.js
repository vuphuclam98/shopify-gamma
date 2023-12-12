/* global GM_STATE */
import appState from 'snippets/cart-global/@store'
import { createContext, Fragment } from 'preact'
import { useContext, useMemo, useEffect } from 'preact/hooks'
import CartGrid from 'snippets/cart-grid/cart-grid'
import CartSidebar from 'snippets/cart-sidebar/cart-sidebar'
import { initBasketTracking } from 'uses/useSearchspringTracking'
import { eventProps } from 'helpers/global'
import { updateCart } from 'helpers/cart'

const AppState = createContext()

function CartMain(props) {
  return (
    <AppState.Provider value={appState()}>
      <App slot={props} />
    </AppState.Provider>
  )
}

function App() {
  const state = useContext(AppState)
  const translate = cartConfig.translates
  const cart = useMemo(() => state.cart.value, [state.cart.value])
  const fetching = useMemo(() => state.fetching.value, [state.fetching.value])
  const hasAgeVerification = useMemo(() => state.hasAgeVerification.value, [state.hasAgeVerification.value])

  useEffect(() => {
    globalEvents.on(eventProps.cart.add, async () => {
      const newCart = await updateCart()
      state.setCart(newCart)
      initBasketTracking(newCart)
    })
  }, [])

  if (!cart?.items?.length) {
    return (
      <div className="container col-span-2 bg-white">
        <div class="py-12 text-center md:py-20 xl:py-[172px]">
          <h1 className="h3 text-2xl md:text-3xl">{translate.empty_cart}</h1>
          <p className="mt-2 mb-4 md:mt-3 md:mb-6">{translate.empty_description}</p>
          <a href="/collections/all" class="button-primary">
            {translate.continue_shopping}
          </a>
        </div>
      </div>
    )
  }

  return (
    <Fragment>
      <form action="/cart" method="POST" id="cart" className="md:bg-grey-100 md:px-8 md:py-12">
        <form method="post" action="/checkout">
          <div className="items-start gap-8 lg:grid lg:grid-flow-col lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_360px]">
            <div class="flex-col rounded-t border-default bg-white md:border md:border-b-0 lg:rounded lg:border">
              <div className="flex items-center justify-between border-b border-default p-4 md:p-6">
                <h1 className="h1 text-xl md:text-3xl">{translate.my_bag}</h1>
                <a className="link text-grey-500" href="/collections/all">
                  {translate.continue_shopping}
                </a>
              </div>
              <CartGrid items={cart.items} setCart={state.setCart} setFetching={state.setFetching} />
            </div>
            <div class="flex-col rounded-b border-t border-default bg-white md:border lg:rounded">
              <CartSidebar cart={cart} fetching={fetching} hasAgeVerification={hasAgeVerification} />
            </div>
          </div>
        </form>
      </form>
    </Fragment>
  )
}

export default CartMain
