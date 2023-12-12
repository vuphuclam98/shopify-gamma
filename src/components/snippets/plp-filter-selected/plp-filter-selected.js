import { useMemo } from 'preact/hooks'
import Icon from 'snippets/icon/icon'
import { formatName, formatRangePrice } from 'helpers/utils'
import { getSelectedValues } from 'uses/useSearchspringUtils'

const selectors = {
  priceKey: 'ss_price'
}

function PlpFilterSelected({ selectedValues, applyFilters }) {
  const values = useMemo(() => getSelectedValues(selectedValues, selectors.priceKey), [selectedValues])

  const handleRemove = (item) => {
    const currentSelectedValues = getCurrentSelectedValues(item)
    applyFilters({
      selectedValues: currentSelectedValues,
      page: 1
    })
  }

  const getCurrentSelectedValues = (item) => {
    const selected = selectedValues
    if (item) {
      if (item.key !== selectors.priceKey) {
        const target = selected[item.key]
        selected[item.key] = target.filter((i) => i !== item.value)
      } else {
        delete selected[item.key]
      }
    }
    return selected
  }

  const onClears = () => {
    applyFilters({
      selectedValues: {},
      page: 1,
      type: 'init'
    })
  }

  const translate = window.plpState.translates

  return values && values.length ? (
    <div className="flex flex-wrap border-b border-default px-4 pb-4">
      {values.map((item) => (
        <button
          type="button"
          className="mt-4 mr-4 flex items-center rounded bg-grey-100 p-3 transition duration-300 ease-in-out hover:bg-grey-100 md:p-4"
          onClick={() => handleRemove(item)}
        >
          <Icon name="icon-close-outline" className="mr-1.5 h-4 w-4 text-grey-500" />
          <span className="text-sm font-bold tracking-normal text-grey-900">
            {item.key === selectors.priceKey ? formatRangePrice(item.value) : formatName(item.value)}
          </span>
        </button>
      ))}
      <button type="button" className="mt-4 ml-2 text-grey-500 underline" onClick={() => onClears()}>
        {translate.clearSelections}
      </button>
    </div>
  ) : (
    ''
  )
}

export default PlpFilterSelected
