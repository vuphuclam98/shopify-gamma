import { Fragment } from 'preact'
import { useState, useEffect } from 'preact/hooks'

function QuantityInput({ min, max, quantity, setQuantity, disabled = false }) {
  const [value, setValue] = useState(quantity)

  const onChange = (count) => {
    const current = value + count
    if (current >= min && current <= max) {
      setValue(current)
    }
  }

  const onChangeInput = (e) => {
    e.preventDefault()
    const currentValue = e.target.value

    if (currentValue) {
      const currentQuantity = parseInt(currentValue)
      if (currentQuantity <= max && currentQuantity >= 0) {
        setValue(currentQuantity)
      }
    }
  }

  useEffect(() => {
    if (value <= max && value >= 0) {
      setQuantity(value)
    }
  }, [value])

  return (
    <Fragment>
      <div className="relative flex items-center justify-between overflow-hidden rounded border border-default">
        <button
          type="button"
          name="minus"
          className={`flex h-10 w-10 items-center justify-center p-2 ${value === min || disabled ? 'bg-grey-100' : ''}`}
          disabled={value === min || disabled}
          onClick={() => onChange(-1)}
        >
          <svg viewBox="0 0 20 20" class="icon" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path id="icon-minus" d="M15.625 10H4.375" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <input
          type="text"
          pattern="[0-9]"
          value={value}
          className="w-6 border-none p-0 text-center text-xs"
          min={min}
          max={max}
          onInput={onChangeInput}
          readonly={disabled}
        />
        <button
          type="button"
          name="plus"
          className={`flex h-10 w-10 items-center justify-center p-2 ${value === max || disabled ? 'bg-grey-100' : ''}`}
          disabled={value === max || disabled}
          onClick={() => onChange(1)}
        >
          <svg viewBox="0 0 20 20" class="icon" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path id="icon-plus" d="M10 4.375v11.25M15.625 10H4.375" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
      {value > max && <span className="text-xs text-error-content">{max > 1 ? `We have ${max} items` : 'We have only 1 item'}</span>}
    </Fragment>
  )
}

export default QuantityInput
