import { Fragment } from 'preact'
import { getImages, groupParamsByKey } from 'uses/useCollectionNativeUtils'
import PlpCard from 'snippets/plp-card/plp-card'
import { useMemo } from 'preact/hooks'

function PlpGridOrigin({ isLoading, products, handle }) {
  const emptyText = useMemo(() => {
    const paramsString = window.location.href.split('?')[1]
    const isSearchPage = window.location.pathname === '/search'
    const paramsDefault = groupParamsByKey(new URLSearchParams(paramsString))
    const translate = window.plpState.translates

    if (isSearchPage) {
      return translate.noResults.replace('{{ terms }}', paramsDefault.searchQuery)
    }
    return translate.noProducts
  }, [])

  return (
    <div class="grid grid-cols-2 divide-default sm:grid-cols-3 xl:grid-cols-4">
      {!isLoading
        ? (products && products.length > 0 ? (
            products.map((product) =>
              <PlpCard
                title={product.title}
                description={product.productProfile}
                handle={product.handle}
                imageUrl={getImages(product.featuredImage)}
                secondImageUrl={product.images}
                variants={product.variants}
                optionsWithValues={product.options_with_values}
                onlyDefaultVariant={product.has_only_default_variant}
                tags={product.tags}
                collectionHandle={handle}
              />
            )
          ) : (
            <div className="p-6">
              <span>{emptyText}</span>
            </div>
          )) : <PlpGridOriginSkeleton />
      }
    </div>
  )
}

function PlpGridOriginSkeleton() {
  return (
    <Fragment>
      {[...Array(12)].map(() => (
        <div class="flex flex-col border-b border-default animate-pulse lg:relative lg:overflow-hidden plp-card content-center">
          <div className="relative mb-2.5 md:mb-4 mr-3.5 lg:mr-[70px]">
            <div className="aspect-square relative bg-[linear-gradient(270deg,#F9FAFB_18.75%,#E5E7EB_179.69%)] w-full pb-[100%]"></div>
          </div>
          <div className="flex flex-col">
            <div className="w-[96px] h-4 bg-[linear-gradient(270deg,#F9FAFB_18.75%,#E5E7EB_179.69%)]"></div>
            <div className="w-2/3 h-[28px] lg:h-[36px] mt-4 lg:mt-2 bg-[linear-gradient(270deg,#F9FAFB_18.75%,#E5E7EB_179.69%)]"></div>
            <div className="w-full mt-2 h-6 bg-[linear-gradient(270deg,#F9FAFB_18.75%,#E5E7EB_179.69%)]"></div>
            <div className="w-full h-px mt-5 bg-[linear-gradient(270deg,#F9FAFB_18.75%,#E5E7EB_179.69%)]"></div>
            <div className="py-4 lg:py-5">
              <div className="w-1/3 h-[22px] bg-[linear-gradient(270deg,#F9FAFB_18.75%,#E5E7EB_179.69%)]"></div>
              <div className="w-2/3 mt-2 h-6 bg-[linear-gradient(270deg,#F9FAFB_18.75%,#E5E7EB_179.69%)]"></div>
            </div>
            <div className="w-full h-px bg-[linear-gradient(270deg,#F9FAFB_18.75%,#E5E7EB_179.69%)]"></div>
            <div className="pb-4 mt-4 lg:mt-5 lg:pb-5">
              <div className="w-1/3 h-[22px] bg-[linear-gradient(270deg,#F9FAFB_18.75%,#E5E7EB_179.69%)]"></div>
              <div className="w-2/3 mt-2 h-4 bg-[linear-gradient(270deg,#F9FAFB_18.75%,#E5E7EB_179.69%)]"></div>
            </div>
          </div>
        </div>
      ))}
    </Fragment>
  )
}

export default PlpGridOrigin
