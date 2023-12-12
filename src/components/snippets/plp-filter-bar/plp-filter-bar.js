import Icon from 'snippets/icon/icon'
import PlpSort from 'snippets/plp-sort/plp-sort'
import { getSelectedValues } from 'uses/useSearchspringUtils'

const selectors = {
  priceKey: 'ss_price'
}

function PlpFilterBar({ isMobile, isLoading, pagination, activeFilters, sortOrder, sortOptions, setActiveFilters, applySort, selectedValues }) {
  const translate = window.plpState.translates

  return (
    <div className="flex justify-between">
      <div className="md:flex-1">
        {isMobile && (
          <button className="flex items-center" onClick={setActiveFilters}>
            <Icon name="icon-filter" className="mr-2 h-5 w-5" viewBox="0 0 20 20" />
            <span className="text-sm font-bold tracking-normal text-gray-900">
              {translate.filters}
              {isMobile &&
                !isLoading &&
                getSelectedValues(selectedValues, selectors.priceKey).length > 0 &&
                `(${getSelectedValues(selectedValues, selectors.priceKey).length})`}
            </span>
          </button>
        )}
      </div>
      {!isLoading && pagination ? <PlpFilterCount total={pagination.totalProducts} /> : <PlpFilterSkeleton className="w-[67px] pr-6" />}
      {!isLoading && sortOptions.length ? (
        <PlpSort isMobile={isMobile} isLoading={isLoading} sortOrder={sortOrder} sortOptions={sortOptions} applySort={applySort} />
      ) : (
        <PlpFilterSkeleton className="w-[110px]" />
      )}
    </div>
  )
}

function PlpFilterCount({ total }) {
  return (
    <div className="text-sm tracking-normal text-grey-700 md:ml-auto md:pr-6">
      <span>{total}</span>
      <span>{`${total > 1 ? ' Items' : ' Item'}`}</span>
    </div>
  )
}

function PlpFilterSkeleton({ className }) {
  return (
    <div className={className}>
      <div className="h-[22px] w-full animate-pulse bg-grey-400"></div>
    </div>
  )
}

export default PlpFilterBar
