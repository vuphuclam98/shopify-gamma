import register from 'preact-custom-element'
import { useEffect, useRef, useState } from 'preact/hooks'
import { getRecentlyProducts, setRecentlyProductsData } from 'uses/useRecentlyProduct'
import { elInViewPort } from 'helpers/dom'
import { fetchData } from 'helpers/global'
import { getProductTitle } from 'uses/useShopify'
import PlpCard from 'snippets/plp-card/plp-card'
import CarouseCustom from 'snippets/carousel-custom/carousel-custom'
import LoaderSpin from 'snippets/loader-spin/loader-spin'
import throttle from 'lodash.throttle'

function ProductRecently({ handle, heading }) {
  const elRef = useRef(null)
  const [products, setProducts] = useState([])
  const [isFetching, setIsFetching] = useState(false)

  const recentlyHandles = getRecentlyProducts().filter((i) => i !== handle)

  const fetchProducts = async (handles) => {
    const allFetchs = handles.map((handle) => {
      return fetchData(`/products/${handle}?view=ajax`).then((product) => {
        return product
      })
    })
    return Promise.all(allFetchs).then((results) => results)
  }

  const init = async (handles) => {
    if (handles.length) {
      setIsFetching(true)
      const products = await fetchProducts(handles)
      const dataProducts = products.filter((product) => product)
      if (dataProducts.length) {
        setProducts(dataProducts)
        const data = dataProducts.map((item) => {
          return (
            item && {
              sku: item.initVariant.sku || ''
            }
          )
        })
        if (data) {
          setRecentlyProductsData(JSON.stringify(data))
        }
      }
      setIsFetching(false)
    } else {
      setIsFetching(false)
    }
  }

  const handleInit = () => {
    if (elInViewPort(elRef.current)) {
      init(recentlyHandles)
      window.removeEventListener('scroll', onInit)
    }
  }

  const onInit = throttle(handleInit, 500)

  useEffect(() => {
    if (recentlyHandles.length > 0) {
      window.addEventListener('scroll', onInit)
    }
  }, [])

  return (
    recentlyHandles.length > 0 && (
      <div className="relative -mt-px border-t" ref={elRef}>
        {!isFetching ? (
          products.length > 0 && (
            <div className="flex flex-col">
              {heading && (
                <div className="container">
                  <h3 className="z-[1] py-4 text-xl font-bold text-grey-900 md:py-8 lg:text-3xl">{heading}</h3>
                </div>
              )}

              <div>
                <CarouseCustom classWrap="border-t" content={<ProductRecentlyItems products={products} />} />
              </div>
            </div>
          )
        ) : (
          <div className="flex py-14">
            <div className="container">
              <LoaderSpin width="8" height="8" />
            </div>
          </div>
        )}
      </div>
    )
  )
}

function ProductRecentlyItems({ products }) {
  return products.map(
    (product) =>
      product && (
        <PlpCard
          className="carousel-item flex w-1/2 flex-shrink-0 snap-start flex-col border-r border-default p-4 sm:w-1/3 lg:relative lg:w-1/4 lg:overflow-hidden lg:pb-8"
          title={getProductTitle(product.title)}
          subtitle={product.title}
          handle={product.handle}
          url={product.url}
          imageUrl={[product.featuredImage]}
          secondImageUrl={product.images}
          available={product.available}
          variants={product.variants}
          options={product.options}
          tags={product.tags}
          price={product.price}
          originalPrice={product.compareAtPriceMin}
        />
      )
  )
}

register(ProductRecently, 'product-recently', ['handle', 'heading'])
