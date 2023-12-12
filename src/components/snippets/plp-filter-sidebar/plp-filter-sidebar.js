import PlpFilterPanel from 'snippets/plp-filter-panel/plp-filter-panel'
import PlpFilterSkeleton from 'snippets/plp-filter-skeleton/plp-filter-skeleton'

function PlpFilterSidebar({ isMobile, isLoading, filters, selectedValues, applyFilters }) {
  const translate = window.plpState.translates

  return !isLoading ? (
    filters.length ? (
      <div className="px-8 py-2">
        <PlpFilterPanel isMobile={isMobile} filters={filters} selectedValues={selectedValues} applyFilters={applyFilters} />
      </div>
    ) : (
      <div className="p-6">
        <span>{translate.noOptionFilter}</span>
      </div>
    )
  ) : (
    <PlpFilterSkeleton />
  )
}

export default PlpFilterSidebar
