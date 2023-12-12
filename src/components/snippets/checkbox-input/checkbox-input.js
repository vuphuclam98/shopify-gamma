import { useState } from 'preact/hooks'
import { formatName } from 'helpers/utils'

function CheckboxInput({ value, label, checked, index, onSelected }) {
  const [isChecked, setIsChecked] = useState(checked)

  const handleSelected = (value) => {
    setIsChecked(!isChecked)
    onSelected(value, !isChecked)
  }

  return (
    <div key={value} className="checkbox-input relative mt-4 flex items-center">
      <input
        id={`${value}-${index}`}
        className="checkbox-input__input"
        type="checkbox"
        value={value}
        checked={isChecked}
        onInput={() => handleSelected(value)}
      />
      <label for={`${value}-${index}`} className="checkbox-input__label">
        {formatName(label)}
      </label>
    </div>
  )
}

export default CheckboxInput
