/* global collectionConfig */
import appState from './@store'
import { createContext } from 'preact'
import { useContext, useEffect, useMemo, useRef } from 'preact/hooks'
import { QUERY_MAPPING, groupParamsByKey } from 'uses/useCollectionNativeUtils'
import PlpFilterBar from 'snippets/plp-filter-bar/plp-filter-bar'
import PlpFilter from 'snippets/plp-filter/plp-filter'
import PlpNativeGrid from 'snippets/plp-native-grid/plp-native-grid'
import PlpPaginationNative from 'snippets/plp-pagination/plp-pagination-native'

const AppState = createContext()

function PlpOrigin(props) {
  return (
    <AppState.Provider value={appState()}>
      <App slot={props} />
    </AppState.Provider>
  )
}

function App(props) {
  const state = useContext(AppState)
  const refPlpFilterBar = useRef(null)
  const handle = props.slot.handle
  const config = collectionConfig

  const isMobile = useMemo(() => state.isMobile.value, [state.isMobile.value])
  const isLoading = useMemo(() => state.isLoading.value, [state.isLoading.value])
  const filters = useMemo(() => state.filters.value, [state.filters.value])
  const products = useMemo(() => state.products.value, [state.products.value])
  const pagination = useMemo(() => state.pagination.value, [state.pagination.value])
  const activeFilters = useMemo(() => state.activeFilters.value, [state.activeFilters.value])
  const sortOptions = useMemo(() => state.sortOptions.value, [state.sortOptions.value])
  const sortOrder = useMemo(() => state.sortOrder.value, [state.sortOrder.value])
  const selectedValues = useMemo(() => state.selectedValues.value, [state.selectedValues.value])

  function initFilters() {
    const paramsString = window.location.href.split('?')[1]
    const isSearchPage = window.location.pathname === '/search'
    const paramsDefault = groupParamsByKey(new URLSearchParams(paramsString))
    paramsDefault.forceUpdate = true
    if (window.location.pathname.includes(QUERY_MAPPING.search.path) || isSearchPage) {
      state.initFilters({
        searchQuery: paramsDefault.searchQuery,
        originalQuery: paramsDefault.originalQuery,
        ...paramsDefault
      })
      state.updateSearchQuery(paramsDefault.searchQuery)
      state.updateOriginalQuery(paramsDefault.originalQuery)
    } else {
      state.initFilters({
        handle,
        ...paramsDefault
      })
      state.updateHandle(handle)
    }
  }

  function addEventPopstate() {
    window.addEventListener('popstate', (event) => {
      const finalParams = event.state !== null ? event.state.params : {}
      const finalUrl = event.state !== null ? event.state.url : null
      finalParams.forceUpdate = true
      const isSearchPage = finalUrl === '/search'
      if ((finalUrl && finalUrl.includes(QUERY_MAPPING.search.path)) || isSearchPage) {
        state.initFilters({
          searchQuery: finalParams.searchQuery,
          ...finalParams
        })
        state.updateSearchQuery(finalParams.searchQuery)
      } else {
        state.onPopState({
          handle,
          ...finalParams
        })
        state.updateHandle(handle)
      }
    })
  }

  useEffect(() => {
    initFilters()
    addEventPopstate()
  }, [])

  return (
    <div className="flex flex-col">
      <div
        className="container top-[56px] z-20 border-b border-default bg-white md:top-[130px] xl:top-0 xl:transition-all xl:delay-300 xl:duration-300 xl-max:sticky xl:[&.is-sticky]:sticky xl:[&.is-sticky]:top-[74px]"
        ref={refPlpFilterBar}
      >
        <div className="relative my-4">
          <PlpFilterBar
            isMobile={isMobile}
            isLoading={isLoading}
            sortOptions={sortOptions}
            sortOrder={sortOrder}
            pagination={pagination}
            activeFilters={activeFilters}
            setActiveFilters={state.setActiveFilters}
            applySort={state.applySort}
            selectedValues={selectedValues}
          />
        </div>
      </div>
      <div className="lg:flex">
        <div className={`overflow-hidden transition-all lg:w-72 lg:border-r ${!isMobile && !activeFilters ? '!w-0 -translate-x-full' : ''}`}>
          <PlpFilter
            isMobile={isMobile}
            isLoading={isLoading}
            filters={filters}
            activeFilters={activeFilters}
            selectedValues={selectedValues}
            setActiveFilters={state.setActiveFilters}
            applyFilters={state.applyFilters}
          />
        </div>
        <div className="transition-all lg:flex-1">
          <PlpNativeGrid isLoading={isLoading} products={products} handle={handle} />
          <PlpPaginationNative isLoading={isLoading} pagination={pagination} goToPage={state.goToPage} />
        </div>
      </div>
    </div>
  )
}

export default PlpOrigin
