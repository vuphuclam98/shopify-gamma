import { getAttribute } from 'helpers/dom'
import { Fragment } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'
import useClickOutSide from 'uses/useClickOutSide'

function PlpSort({ sortOptions, sortOrder, isMobile, applySort }) {
  const getCurrentSort = (orders) => (orders ? sortOptions.find((item) => orders.direction === item.direction) : null)
  const [isActive, setIsActive] = useState(false)
  const [localSort, setLocalSort] = useState(getCurrentSort(sortOrder))
  const refSortEl = useRef(null)

  const handleClickOutSide = () => {
    setIsActive(false)
  }

  useEffect(() => {
    if (!localSort) {
      setLocalSort(sortOptions[0])
    }
  }, [])

  useClickOutSide(refSortEl, handleClickOutSide)

  return (
    <div className="flex items-center" ref={refSortEl}>
      <div className="mr-1 text-sm tracking-normal text-grey-900">Sort:</div>
      {isMobile ? (
        <PlpSortSelect options={sortOptions} sortOrder={sortOrder} localSort={localSort} setLocalSort={setLocalSort} applySort={applySort} />
      ) : (
        <PlpSortDropdown
          options={sortOptions}
          sortOrder={sortOrder}
          localSort={localSort}
          setLocalSort={setLocalSort}
          applySort={applySort}
          isActive={isActive}
          setIsActive={setIsActive}
        />
      )}
    </div>
  )
}

function PlpSortDropdown({ options, localSort, setLocalSort, applySort, isActive, setIsActive }) {
  const handleActive = () => {
    setIsActive(!isActive)
  }

  const handleChange = (e) => {
    const name = getAttribute('data-value', e.target)
    const current = options.find((item) => item.label === name)
    setLocalSort(current)
    applySort(current)
  }

  return (
    <Fragment>
      <button className="text-sm tracking-normal text-grey-700 underline" onClick={() => handleActive()}>
        {localSort && localSort.label}
      </button>
      {isActive && (
        <div className="absolute top-[38px] right-0 z-30 w-[140px] border border-default bg-white px-3 py-2">
          {options.map((item) => (
            <div
              className={`cursor-pointer py-1 text-xs hover:underline ${item.active ? 'underline' : ''}`}
              data-value={item.label}
              key={item.label}
              onClick={handleChange}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </Fragment>
  )
}

function PlpSortSelect({ options, localSort, setLocalSort, applySort }) {
  const handleChange = (e) => {
    const current = options.find((item) => item.label === e.target.value)
    setLocalSort(current)
    applySort(current)
  }
  return (
    <Fragment>
      <span className="pointer-events-none text-sm tracking-normal text-grey-700 underline">{localSort && localSort.label}</span>
      <select
        className="absolute top-0 right-0 appearance-none border-0 bg-none p-0 text-sm tracking-normal text-gray-700 opacity-0"
        onChange={handleChange}
      >
        {options.map((item) => (
          <option value={item.label} key={item.label} selected={(item.direction && item.direction === localSort.direction) || item.active}>
            {item.label}
          </option>
        ))}
      </select>
    </Fragment>
  )
}

export default PlpSort
