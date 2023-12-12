function PlpFilterApply({ handleApply }) {
  const translate = window.plpState.translates
  return (
    <div className="border-t border-default p-4">
      <button type="button" className="button-primary w-full" onClick={handleApply}>
        {translate.apllyFilter}
      </button>
    </div>
  )
}

export default PlpFilterApply
