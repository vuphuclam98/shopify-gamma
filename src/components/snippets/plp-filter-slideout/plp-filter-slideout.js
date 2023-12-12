import { Fragment } from 'preact'
import { useState } from 'preact/hooks'
import Icon from 'snippets/icon/icon'
import PlpFilterPanel from 'snippets/plp-filter-panel/plp-filter-panel'
import PlpFilterApply from 'snippets/plp-filter-apply/plp-filter-apply'
import PlpFilterSkeleton from 'snippets/plp-filter-skeleton/plp-filter-skeleton'

function PlpFilterSlideout({ isMobile, isLoading, filters, activeFilters, selectedValues, setActiveFilters, applyFilters }) {
  const [selected, setSelected] = useState([])

  const handleClose = () => setActiveFilters()

  const handleApply = () => {
    applyFilters({
      selectedValues: selected
    })
    setActiveFilters()
  }

  const translate = window.plpState.translates

  return (
    <Fragment>
      <div
        className={`fixed top-0 right-0 bottom-0 z-40 h-full w-[336px] translate-x-[336px] bg-white transition-transform ${
          activeFilters ? 'translate-x-[0]' : ''
        }`}
      >
        <div className="relative flex items-center border-b border-default py-3">
          <button onClick={handleClose} aria-label="close filter">
            <Icon name="icon-close-outline" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-grey-500" />
          </button>
          <div className="flex-1 text-center text-xl font-bold text-grey-900">{translate.filters}</div>
        </div>
        {filters.length ? (
          !isLoading ? (
            <Fragment>
              <PlpFilterPanel
                className="h-[calc(100%-130px)] overflow-y-auto px-4"
                isMobile={isMobile}
                filters={filters}
                activeFilters={activeFilters}
                selectedValues={selectedValues}
                localSelectedValues={setSelected}
                isSlideout={true}
              />
              <PlpFilterApply handleApply={handleApply} />
            </Fragment>
          ) : (
            <PlpFilterSkeleton />
          )
        ) : (
          <div className="p-6">{translate.noOptionFilter}</div>
        )}
      </div>
      {activeFilters && <div className="fixed top-0 left-0 z-30 h-full w-full bg-dark-overlay" onClick={handleClose}></div>}
    </Fragment>
  )
}

export default PlpFilterSlideout
