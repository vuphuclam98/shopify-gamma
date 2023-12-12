import { useState, useEffect } from 'preact/hooks'
import AccordionItem from 'snippets/accordion-item/accordion-item'
import PlpFilterGroup from 'snippets/plp-filter-group/plp-filter-group'
import PlpFilterGroupSelected from 'snippets/plp-filter-group-selected/plp-filter-group-selected'

function PlpFilterPanel({ className, isMobile, filters, selectedValues, localSelectedValues, isSlideout = false, applyFilters }) {
  const [selected, setSelected] = useState(selectedValues)

  const localSelected = (id, values) => {
    setSelected((prevState) => ({
      ...prevState,
      [id]: values
    }))
  }

  useEffect(() => {
    if (localSelectedValues) {
      localSelectedValues(selected)
    }
  }, [selected])

  return (
    <div className={className}>
      {filters.map((filter) => (
        <AccordionItem
          titleClass="pb-0"
          wrapperClass="pb-5 last:md:border-b-0 lg:border-b"
          key={filter.field}
          defaultActive={selectedValues[filter.field] && selectedValues[filter.field].length}
          filter={filter}
          heading={filter.label}
          content={
            <PlpFilterGroup isMobile={isMobile} field={filter} selectedValues={selectedValues} localSelected={localSelected} applyFilters={applyFilters} />
          }
          subContent={<PlpFilterGroupSelected field={filter.field} values={!isSlideout ? selectedValues[filter.field] : selected[filter.field]} />}
          isOverflow={!['slider'].includes(filter.type)}
        />
      ))}
    </div>
  )
}

export default PlpFilterPanel
