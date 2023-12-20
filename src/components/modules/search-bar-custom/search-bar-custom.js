import { h, render, createContext } from 'preact'
import { useEffect, useContext, useState, useReducer, useRef } from 'preact/hooks'
import Icon from 'snippets/icon/icon'
import PlpCard from 'snippets/plp-card/plp-card'
import { getImages, getAvailable, getVariants, getOptions, getTags, getPrice, checkItemInCart } from 'uses/useSearchspringUtils'
import { getProductTitle } from 'uses/useShopify'
import LoaderSpin from 'snippets/loader-spin/loader-spin'
import debounce from 'lodash.debounce'

// use translate for title, from src/components/snippets/globals/gm-state.liquid file
const translates = window.dropdownSearch.translates
// set default value 0 as false for action open input search
const initialState = 0
// use data global from src/components/snippets/globals/gm-state.liquid file
const trendingProducts = window.GM_STATE.trending_product_search.products
const popularSearches = window.GM_STATE.trending_product_search.popular_searches

const reducer = (open, action) => {
  // ************************************
  // case open is return true, open input search bar
  // case close is return true, close input search bar
  // code here...
  switch (action) {
    case 'open': return 1
    case 'close': return 0
    default: throw new Error('Unexpected action')
  }
}

// ************************************
// App function render các phần tử element ()
// case close is return true, close input search bar

function App() {
  // tạo biến lưu trữ reducer, để quản lí thay đổi của chức năng đóng mở form input
  const [open, dispatch] = useReducer(reducer, initialState)
  // tạo biến lưu trữ useState, để quản lí thay đổi value input
  const [originalQuery, setOriginalQuery] = useState(null)
  // tạo biến lưu trữ useRef, dùng để tương tác đến input, xử lí chức năng focus sau khi hien thi form search
  const inputRef = useRef()
  const focusInput = () => {
    dispatch('open')
    setTimeout(() => {
      inputRef.current.focus()
    }, 300)
  }

  // su dung useRef làm chậm xử lí data khi thay đổi value input
  const debounceDropDown = useRef(debounce((nextValue) => setOriginalQuery(nextValue), 300)).current
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
      {/* open = 1 as open = True, open search bar */}
      { open === 1
        ? <>
            <form action="/search" role="search" className="search search-form">
              <input
              ref={inputRef}
              value={originalQuery}
              onInput={handleInputOnInput}
              type="text"
              className="input w-full py-2.5 h-12 pl-3.5 pr-14 rounded focus:outline-none"
              placeholder="I'm looking for..."
              />
              <button className="absolute right-2.5 top-1/2 -translate-y-1/2" onClick={() => dispatch('close')}>
              <Icon className="mr-2 mb-0.5 h-6 w-6" name="icon-close-outline" viewBox="0 0 16 16" />
              </button>
            </form>
            {/* show result search dropdow */}
            <SearchBarNativeDropdown originalQuery={originalQuery} />
          </>
        : <button onClick={focusInput} className="absolute right-0 top-1/2 -translate-y-1/2">
            <Icon className="mr-2 h-6 w-6" name="icon-search" viewBox="0 0 16 16" />
          </button>
      }
    </div>
  )
}

// ************************************
// SearchBarNativeDropdown function
// 1 lấy vale input từ biến originalQuery, xử lý fetch để lấy data search từ value input
function SearchBarNativeDropdown({ originalQuery }) {
  const [searchData, setSearchData] = useState(null)
  const fetchData = async () => {
    try {
      const response = await fetch(`/search/suggest.json?q=${encodeURIComponent(originalQuery)}`)
      if (!response.ok) {
        const error = new Error(response.status)
        throw error
      }
      const data = await response.json()
      setSearchData(data?.resources?.results)
    } catch (error) {
      console.error(error)
      setSearchData(null)
    }
  }
  // useEffect thực thi hàm SearchBarNativeDropdown, fetch data mỗi khi value input được thay đổi,
  useEffect(() => {
    fetchData()
  }, [originalQuery])
  // code here...
  return (
    <div className="search-result-dropdown absolute top-full w-full sm:flex bg-white">
      <div className="popular-searches sm:max-w-[200px] lg:max-w-[248px] w-full border-r border-default">
        {/* kiểm tra và hiển thị danh sách suggestions tìm kiếm được */}
        {/* code here... */}
        {searchData && searchData.queries.length > 0 &&
          (
            <div className="queries mb-6 w-full first:pt-6 px-6">
                <h5 className="font-GillSans text-xs text-primary font-semibold uppercase tracking-sm">{ translates.suggestions }</h5>
                { searchData.queries.map((item) => {
                  return <a href={item.url} className="item block mt-2 hover:underline">{item.text}</a>
                })
                }
            </div>
          )
        }
        {/* kiểm tra và hiển thị danh sách collection tìm kiếm được */}
        {/* code here... */}
        {searchData && searchData.collections.length > 0 &&
          (
            <div className="collections mb-6 w-full first:pt-6 px-6">
                <h5 className="font-GillSans text-xs text-primary font-semibold uppercase tracking-sm">{ translates.collections }</h5>
                { searchData.collections.map((item) => {
                  return <a href={item.url} className="item block mt-2 hover:underline">{item.title}</a>
                })
                }
            </div>
          )
        }
        {/* kiểm tra và hiển thị danh sách page tìm kiếm được */}
        {/* code here... */}
        {searchData && searchData.pages.length > 0 &&
          (
            <div className="pages mb-6 w-full first:pt-6 px-6">
                <h5 className="text-xs text-primary font-semibold uppercase tracking-sm">{ translates.pages }</h5>
                { searchData.pages.map((item) => {
                  return <a href={item.url} className="item block mt-2 hover:underline">{item.title}</a>
                })
                }
            </div>
          )
        }
        {/* hiển thị danh sách tìm kiếm phổ biến, khi không tìm được sản phầm liên quan */}
        {/* code here... */}
        {searchData?.products?.length < 1 &&
          <div className="popular-search mb-6 w-full first:pt-6 px-6">
              <h5 className="text-xs text-primary font-semibold uppercase tracking-sm">{ translates.popular_searches }</h5>
              {popularSearches.items.map((item) => {
                return <a href={item.url} className="item block mt-2 hover:underline">{item.title}</a>
              })}
          </div>
        }
      </div>
      <div className="products-search relative">
        {/* kiểm tra sản phẩm tìm kiếm, nếu không có sẽ hiển thị danh sách trending product */}
        <div className="p-4 pt-0 sm:pt-6 xl:p-6 uppercase [&>h5]:text-primary">
          { searchData?.products?.length > 0
            ? <h5 className="text-xs text-primary font-semibold uppercase tracking-sm">{ translates.products }</h5>
            : <h5 className="text-xs text-primary font-semibold uppercase tracking-sm">{ translates.trending_product }</h5> }
        </div>
        {/* kiểm tra sản phẩm tìm kiếm, nếu không có sẽ hiển thị danh sách trending product */}
        <div className={`w-full grid grid-cols-2 gap-4 lg:gap-6 lg:grid-cols-3 max-h-[402px] overflow-auto scrollbar-hide bg-white px-4 xl:px-6 ${searchData?.products?.length > 6 ? ' pb-12' : ''}`}>
          { searchData?.products?.length > 0
            ? <ProductItemsSearch products={searchData.products} />
            : <ProductItemsTrending products={trendingProducts} />
          }
        </div>
        {/* hiển thị tổng số sản phẩm tìm kiếm được */}
        {searchData?.products?.length > 6 && (
          <a href="" className="text-center p-3 text-primary bg-white absolute bottom-0 border-t w-full border-default">View all {searchData?.products?.length} products</a>
        )}
      </div>
    </div>
  )
}

// function hiển thị content danh sách sản phầm có kết quả tìm kiếm
function ProductItemsSearch({ products }) {
  return products.slice(0, 6).map(
    (product) =>
      product && (
        <PlpCard
          className="plp-card-search relative sm:flex sm:[&>.plp-card-image]:w-32 sm:[&>.plp-card-image]:h-32 sm:[&>.plp-card-image]:pb-1 xl:[&>.plp-card-title]:ml-3"
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

// function hiển thị content danh sách sản phầm trending
function ProductItemsTrending({ products }) {
  return products.slice(0, 6).map(
    (product) =>
      product && (
        <PlpCard
          className="plp-card-search relative sm:flex sm:[&>.plp-card-image]:w-32 sm:[&>.plp-card-image]:h-32 sm:[&>.plp-card-image]:pb-1 xl:[&>.plp-card-title]:ml-3"
          title={getProductTitle(product.title)}
          subtitle={product.title}
          url={product.url}
          imageUrl={getImages(product.featured_image, product.thumbnailImageUrl)}
          secondImageUrl={product.images}
          variants={product.variants}
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
// truyền component đến phần tử tag search-bar-native-custom
render(<App />, document.querySelector('search-bar-native-custom'))
