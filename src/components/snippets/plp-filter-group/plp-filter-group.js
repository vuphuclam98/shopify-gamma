import PlpFilterSlider from 'snippets/plp-filter-slider/plp-filter-slider'
import PlpFilterItems from 'snippets/plp-filter-items/plp-filter-items'

function PlpFilterGroup({ isMobile, field, selectedValues, localSelected, applyFilters }) {
  return (
    <div className="mt-4">
      {field.type === 'slider' ? (
        <PlpFilterSlider isMobile={isMobile} field={field} selectedValues={selectedValues} localSelected={localSelected} applyFilters={applyFilters} />
      ) : (
        <PlpFilterItems isMobile={isMobile} field={field} selectedValues={selectedValues} localSelected={localSelected} applyFilters={applyFilters} />
      )}
    </div>
  )
}

export default PlpFilterGroup
