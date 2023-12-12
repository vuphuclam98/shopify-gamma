/* global globalEvents */
import appState from 'snippets/cart-global/@store'
import { createContext, Fragment } from 'preact'
import { eventProps } from 'helpers/global'
import { select } from 'helpers/dom'
import { initBasketTracking } from 'uses/useSearchspringTracking'
import { updateCart, openMiniCart } from 'helpers/cart'
import { useContext, useEffect, useMemo, useState } from 'preact/hooks'
import MiniCartList from 'snippets/mini-cart-list/mini-cart-list'
import MiniCartRelated from 'snippets/mini-cart-related/mini-cart-related'
import MiniCartButton from 'snippets/mini-cart-button/mini-cart-button'
import LoaderSpin from 'snippets/loader-spin/loader-spin'
import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock'

const selectors = {
  miniCartContentSelector: '.js-mini-cart-content',
  miniCartOpenedSelector: '.modal-dialog-mini-cart.modal-dialog-opened'
}

const AppState = createContext()

function MiniCart(props) {
  return (
    <AppState.Provider value={appState()}>
      <App slot={props} />
    </AppState.Provider>
  )
}

function App(props) {
  const state = useContext(AppState)

  const translate = cartConfig.translates

  const [isLoaded, setIsLoaded] = useState(false)

  const cart = useMemo(() => state.cart.value, [state.cart.value])

  const fetching = useMemo(() => state.fetching.value, [state.fetching.value])

  const init = () => {
    if (!isLoaded) {
      setIsLoaded(true)
    }
  }

  useEffect(() => {
    setTimeout(() => {
      globalEvents.on(eventProps.cart.add, async (value) => {
        const newCart = await updateCart()
        state.setCart(newCart)
        openMiniCart()
        initBasketTracking(newCart)
        init()
      })
      globalEvents.on(eventProps.cart.render, () => {
        init()
      })
    }, 500)
  }, [])

  useEffect(() => {
    const isMiniCartOpened = select(selectors.miniCartOpenedSelector)
    if (isMiniCartOpened) {
      clearAllBodyScrollLocks()
      const contentEl = select(selectors.miniCartContentSelector)
      contentEl && disableBodyScroll(contentEl)
    }
  }, [cart])

  return (
    <div className="relative flex h-[calc(100%-53px)] flex-col md:h-[calc(100%-69px)]">
      <form action="/cart" method="POST" id="cart" className="mini-cart-content scrollbar js-mini-cart-content overflow-y-auto overflow-x-hidden">
        {cart && cart.items.length ? (
          isLoaded ? (
            <Fragment>
              <MiniCartList items={cart.items} setCart={state.setCart} setFetching={state.setFetching} fetching={fetching} />
              <MiniCartButton cart={cart} fetching={fetching} />
            </Fragment>
          ) : (
            <div className="flex items-center justify-center">
              <LoaderSpin width="10" height="10" />
            </div>
          )
        ) : (
          <div className="container col-span-2 bg-white">
            <div class="py-12 text-center md:py-20 xl:py-10">
              <h1 className="h3 text-2xl md:text-3xl">{translate.empty_cart}</h1>
              <p className="mt-2 mb-4 md:mt-3 md:mb-6">{translate.empty_description}</p>
              <a href="/collections/all" className="button-primary">
                {translate.continue_shopping}
              </a>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default MiniCart
