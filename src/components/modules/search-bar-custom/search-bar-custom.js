import { h, render } from 'preact'
import { useEffect, useState, useReducer } from 'preact/hooks'
import register from 'preact-custom-element'
import Icon from 'snippets/icon/icon'

const initialState = 0
const reducer = (state, action) => {
  switch (action) {
    case 'open': return 1
    case 'close': return 0
    case 'reset': return 0
    default: throw new Error('Unexpected action')
  }
}
const App = () => {
  const [count, dispatch] = useReducer(reducer, initialState)
  if (count === 0) {
    return (
      <>
        <div id="btn-search" class="relative btn-search">
        <input
        type="text"
        class="input w-full py-2.5 h-12 pl-3.5 pr-14 rounded"
        placeholder="What are you looking for?"
        />
            <button onClick={() => dispatch('open')}>
              <Icon className="mr-2 mb-0.5 h-4 w-4 text-error-content" name="icon-close-outline" viewBox="0 0 16 16" />
            </button>
            <button onClick={() => dispatch('close')}>
            <Icon className="mr-2 mb-0.5 h-4 w-4 text-error-content" name="icon-close-outline" viewBox="0 0 16 16" />
            </button>
          </div>
      </>
    )
  }
}

// register(CartMain, 'cart-main')
// customElements.define('search-bar-native-custom', CartPage)
render(<App />, document.querySelector('search-bar-native-custom'))
