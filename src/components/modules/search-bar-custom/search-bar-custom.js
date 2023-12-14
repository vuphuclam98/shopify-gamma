import { h, render, createContext } from 'preact'
import { useEffect, useContext, useState, useReducer, useRef } from 'preact/hooks'
import Icon from 'snippets/icon/icon'
import PlpCard from 'snippets/plp-card/plp-card'
import { getImages, getAvailable, getVariants, getOptions, getTags, getPrice, checkItemInCart } from 'uses/useSearchspringUtils'
import { getProductTitle } from 'uses/useShopify'
import LoaderSpin from 'snippets/loader-spin/loader-spin'
import debounce from 'lodash.debounce'

const initialState = 0
const reducer = (state, action) => {
  switch (action) {
    case 'open': return 1
    case 'close': return 0
    default: throw new Error('Unexpected action')
  }
}

function App() {
  const [open, dispatch] = useReducer(reducer, initialState)
  const [originalQuery, setOriginalQuery] = useState(null)
  const inputRef = useRef()
  const focusInput = () => {
    dispatch('open')
    setTimeout(() => {
      inputRef.current.focus()
    }, 300)
  }
  const debounceDropDown = useRef(debounce((nextValue) => setOriginalQuery(nextValue), 500)).current
  const handleInputOnInput = (e) => {
    const { value } = e.target
    if (value.trim().length > 0) {
      debounceDropDown(value)
    } else {
      setOriginalQuery(null)
    }
  }
  return (
    <div id="btn-search" class="relative btn-search">
      { open === 1
        ? <>
            <form>
              <input
              ref={inputRef}
              value={originalQuery}
              onInput={handleInputOnInput}
              type="text"
              class="input w-full py-2.5 h-12 pl-3.5 pr-14 rounded"
              placeholder="I'm looking for..."
              />
              <button className="absolute right-2.5 top-1/2 -translate-y-1/2" onClick={() => dispatch('close')}>
              <Icon className="mr-2 mb-0.5 h-6 w-6" name="icon-close-outline" viewBox="0 0 16 16" />
              </button>
            </form>
            <SearchBarNativeDropdown originalQuery={originalQuery} />
          </>
        : <button onClick={focusInput} className="absolute right-0 top-1/2 -translate-y-1/2">
            <Icon className="mr-2 h-6 w-6" name="icon-search" viewBox="0 0 16 16" />
          </button>
      }
    </div>
  )
}

function SearchBarNativeDropdown({ originalQuery }) {
  const [searchData, setSearchData] = useState(null)
  const [isFetching, setIsFetching] = useState(false)
  const fetchData = async () => {
    setIsFetching(true)
    try {
      const response = await fetch(`/search/suggest.json?q=${encodeURIComponent(originalQuery)}`)
      if (!response.ok) {
        const error = new Error(response.status)
        throw error
      }
      const data = await response.json()
      setSearchData(data?.resources?.results)
      setIsFetching(false)
    } catch (error) {
      console.error(error)
      setSearchData(null)
      setIsFetching(false)
    }
  }
  useEffect(() => {
    fetchData()
  }, [originalQuery])
  return (
    <div className="search-result-dropdown">
      <div className="popular-searches"></div>
      <div className="trending-products absolute top-full w-full grid grid-cols-3 max-h-96 overflow-auto bg-white">
        { searchData?.products?.length > 0
          ? <>
            <ProductItems products={searchData.products} />
            {searchData?.products?.length > 6 && (
              <div>View all {searchData?.products?.length} products</div>
            )}
          </>
          : ''
        }
      </div>
    </div>
  )
}

function ProductItems({ products }) {
  return products.map(
    (product) =>
      product && (
        <PlpCard
          className="plp-card-search relative flex flex-col"
          title={getProductTitle(product.title)}
          subtitle={product.title}
          url={product.url}
          imageUrl={getImages(product.image, product.thumbnailImageUrl)}
          secondImageUrl={product.images}
          variants={product.variants}
          options={getOptions(product.options)}
          tags={getTags(product.tags)}
          price={getPrice(product.price)}
          originalPrice={getPrice(product.msrp)}
          inSuggestion={true}
          showQuickAdd={false}
          handle={product.handle}
        />
      )
  )
}

render(<App />, document.querySelector('search-bar-native-custom'))
