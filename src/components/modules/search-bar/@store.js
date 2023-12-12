import { signal } from '@preact/signals'
import { on } from 'helpers/dom'
import { useEffect } from 'preact/hooks'
import { clearAllBodyScrollLocks } from 'body-scroll-lock'
import SearchSpringService from 'uses/useSearchspring'
import throttle from 'lodash.throttle'

const { searchSpringConfig } = window.GM_STATE.integrations

const selectors = {
  mobileBreakpoint: 768,
  collectionIgnore: ['All'],
  maxProductOnMobile: 6,
  maxProductOnDesktop: 5
}

function appState() {
  const SearchSpringInstance = new SearchSpringService({
    siteId: searchSpringConfig.siteId,
    enable: searchSpringConfig.enable
  })

  const originalQuery = signal('')
  const correctedQuery = signal('')
  const searchValue = signal('')
  const suggestions = signal([])
  const isOpenDropdown = signal(false)
  const isLoading = signal(false)
  const results = signal([])
  const collections = signal([])
  const redirectUrl = signal('')
  const totalResults = signal(0)
  const isMobile = signal(detectBreakpoint())
  const maxSuggestionsProducts = signal(detectMaxProducts())

  useEffect(() => {
    on(
      'resize',
      throttle(() => {
        isMobile.value = detectBreakpoint()
      }, 100),
      window
    )
  }, [])

  useEffect(() => {
    maxSuggestionsProducts.value = detectMaxProducts()
  }, [isMobile])

  function detectMaxProducts() {
    return isMobile.value ? selectors.maxProductOnMobile : selectors.maxProductOnDesktop
  }

  function detectBreakpoint() {
    return window.innerWidth < selectors.mobileBreakpoint
  }

  async function getSuggestion(value) {
    isOpenDropdown.value = true
    setIsLoading(true)
    setOriginalQuery(value)
    const response = await SearchSpringInstance.getSuggestion(value)
    const data = await response.json()
    suggestions.value = getSuggestionFiltered(data)
    correctedQuery.value = data['corrected-query'] || ''
    const suggestedQuery =
      suggestions.value && suggestions.value.length && suggestions.value[0] && suggestions.value[0].text ? suggestions.value[0].text : originalQuery.value
    const finalQuery = correctedQuery.value || suggestedQuery
    searchValue.value = finalQuery
    await onSearching(finalQuery)
    setIsLoading(false)
  }

  async function onSearching(query) {
    if (query) {
      await onFetch(query)
    } else {
      closeDropdown()
    }
  }

  async function onFetch(query) {
    try {
      const payload = {
        perPage: maxSuggestionsProducts.value
      }
      const response = await SearchSpringInstance.getSearchResults(query, 'autocomplete', payload)
      if (response) {
        results.value = response.results
        collections.value = getCollections(response.facets, 'collection_name')
        if (response.merchandising && response.merchandising.redirect !== null) {
          redirectUrl.value = response.merchandising.redirect
        }
        if (response.pagination) {
          totalResults.value = response.pagination.totalResults
        }
      }
    } catch (e) {
      console.error('Could not fetch from searchspring for query: ', query, e)
    }
  }

  function getCollections(facets, target) {
    const relevantFacet = facets.find((item) => item.field === target)
    if (relevantFacet && relevantFacet.values) {
      return relevantFacet.values.filter((x) => !selectors.collectionIgnore.includes(x.value)).slice(0, 5)
    }
    return []
  }

  function closeDropdown() {
    isOpenDropdown.value = false
    results.values = []
    totalResults.value = 0
    collections.value = []
    clearAllBodyScrollLocks()
  }

  function getSuggestionFiltered(suggestions) {
    const values = []
    if (suggestions.suggested) {
      values.push(suggestions.suggested)
    }
    if (suggestions.alternatives && suggestions.alternatives.length) {
      suggestions.alternatives.forEach((item) => {
        if (!item.text.includes('?')) {
          values.push(item)
        }
      })
    }
    return values
  }

  function setOriginalQuery(value) {
    originalQuery.value = value
  }

  function setIsLoading(value) {
    isLoading.value = value
  }

  return {
    isMobile,
    originalQuery,
    correctedQuery,
    searchValue,
    suggestions,
    collections,
    results,
    isOpenDropdown,
    isLoading,
    totalResults,
    redirectUrl,
    maxSuggestionsProducts,
    getSuggestion,
    setOriginalQuery,
    closeDropdown
  }
}

export default appState
