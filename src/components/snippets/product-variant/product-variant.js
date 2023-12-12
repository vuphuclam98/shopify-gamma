/* global globalEvents */
import { useEffect, useMemo, useState } from 'preact/hooks'
import { eventProps } from 'helpers/global'
import { Fragment } from 'preact'
import { hasOwnProperties } from 'helpers/utils'

const colourKeys = ['Colours', 'Colors']

function ProductVariant(props) {
  const [selected, setSelected] = useState({})
  const [selectableValues, setSelectableValues] = useState({})
  const localState = props.state

  const getSelectableValues = (a, b) => {
    const values = Object.assign({}, a)
    const selectedOptions = Object.keys(b)
    if (!selectedOptions.length) {
      return values
    }
    for (const selectedOption of selectedOptions) {
      const selectedValue = b[selectedOption]
      const otherOptions = props.options.filter((option) => option !== selectedOption)
      if (otherOptions.length) {
        for (const otherOption of otherOptions) {
          values[otherOption] = values[otherOption].filter((value) => {
            return props.variants.some((variant) => variant.options.indexOf(value) !== -1 && variant.options.indexOf(selectedValue) !== -1 && variant.available)
          })
        }
      } else {
        values[selectedOption] = values[selectedOption].filter((value) => {
          if (props.options.length > 1) {
            return props.variants.some((variant) => variant.options.indexOf(value) !== -1 && variant.options.indexOf(selectedValue) !== -1 && variant.available)
          } else {
            return props.variants.some((variant) => variant.options.indexOf(selectedValue) !== -1 && variant.available)
          }
        })
      }
    }
    return values
  }

  const getSelectedVariant = (selectedValues) => {
    const matched = props.variants.filter((variant) => {
      const matchedOptions = []
      for (const option in selectedValues) {
        matchedOptions.push(variant.options.includes(selectedValues[option]))
      }
      return matchedOptions.reduce((result, item) => result && item, [])
    })

    return matched[0]
  }

  const getInitalSelected = (currentVariant) => {
    const values = {}
    for (const index in props.options) {
      const option = props.options[index]

      if (!values[option]) {
        values[option] = []
      }

      const value = currentVariant.options[index]
      if (!values[option].includes(value)) {
        values[option] = value
      }
    }

    return values
  }

  const setUrlParams = (variant) => {
    const urlParams = new URLSearchParams(window.location.search)
    if (!urlParams.has('variant')) {
      urlParams.append('variant', variant.id)
    } else {
      urlParams.set('variant', variant.id)
    }
    window.history.replaceState({}, null, `${window.location.pathname}?${urlParams.toString()}`)
  }

  useEffect(() => {
    const selectedInit = getInitalSelected(props.initVariant)
    setSelected(selectedInit)
  }, [])

  const availableValues = useMemo(() => {
    const values = {}
    for (const index in props.options) {
      const option = props.options[index]

      if (!values[option]) {
        values[option] = []
      }

      for (const variant of props.variants) {
        const value = variant.options[index]
        if (!values[option].includes(value)) {
          values[option].push(value)
        }
      }
    }
    return values
  }, [])

  useMemo(() => {
    const values = getSelectableValues(availableValues, selected)
    setSelectableValues(values)
  }, [availableValues, selected])

  const selectedVariant = useMemo(() => getSelectedVariant(selected), [selected])

  const isOnlyVariantDefault = useMemo(() => {
    return props.variants.length === 1 && props.variants[0].title === 'Default Title'
  }, [])

  useEffect(() => {
    if (selectedVariant) {
      localState.setCurrentVariant(selectedVariant)
      if (props.updateUrl) {
        setUrlParams(selectedVariant)
      }
      globalEvents.emit(eventProps.product.updateVariant, selectedVariant)
    }
  }, [selected])

  return (
    <div className="flex flex-col pb-4 text-sm">
      {!isOnlyVariantDefault &&
        Object.entries(availableValues).map(([key, values], index) => (
          <VariantGroup
            key={index}
            name={key}
            values={values}
            selected={selected}
            selectableValues={selectableValues}
            setSelected={setSelected}
            displayType={props.displayType}
            isModal={props.isModal}
          />
        ))}
    </div>
  )
}

function VariantGroup(props) {
  return (
    <div className={`mt-5 ${colourKeys.includes(props.name) ? 'order-first' : ''}`}>
      {props.displayType === 'dropdown' ? (
        <VariantDropdown
          items={props.values}
          option={props.name}
          selected={props.selected}
          selectableValues={props.selectableValues}
          setSelected={props.setSelected}
        />
      ) : (
        <Fragment>
          <div>
            <span className="mr-1">{props.name}:</span>
            {hasOwnProperties(props.name, props.selected) && props.selected[props.name] && (
              <strong className="text-grey-900">{props.selected[props.name]}</strong>
            )}
          </div>
          <VariantList
            items={props.values}
            option={props.name}
            selected={props.selected}
            selectableValues={props.selectableValues}
            setSelected={props.setSelected}
            isModal={props.isModal}
          />
        </Fragment>
      )}
    </div>
  )
}

function VariantItem(props) {
  const onSelect = (value, option) => {
    props.selected = { ...props.selected, [option]: value }
    props.setSelected(props.selected)
  }

  const isSelected = hasOwnProperties(props.option, props.selected) && props.selected[props.option] === props.value

  const isDisabled = hasOwnProperties(props.option, props.selectableValues) && !props.selectableValues[props.option].includes(props.value)

  const isColour = colourKeys.includes(props.option)

  const getSwatchClass = (name) => {
    return `colour-swatch-${name.toLowerCase()}`
  }

  return (
    <Fragment>
      {!isColour ? (
        <button
          type="button"
          className={`mt-2 rounded border border-default text-center font-bold text-grey-900 ${isSelected && 'border-2 border-grey-900 py-[13px]'} ${
            isDisabled && '!border border-grey-100 py-[13px] text-grey-400'
          } ${isDisabled && isSelected && '!border !border-default !text-grey-900'} ${
            props.isModal ? 'w-[calc((100%/3)-11px)] min-w-fit p-3.5' : 'py-3.5 px-6'
          }`}
          name={props.value}
          onClick={() => onSelect(props.value, props.option)}
        >
          {props.value}
        </button>
      ) : (
        <button
          type="button"
          className={`relative mt-2 h-12 w-12 rounded-full border-[3px] border-white outline outline-1 outline-transparent ${getSwatchClass(props.value)} ${
            isSelected && 'outline-default'
          } ${isDisabled && 'before:absolute before:left-0 before:h-[1px] before:w-full before:rotate-[135deg] before:bg-white before:content-[""]'}`}
          name={props.value}
          onClick={() => onSelect(props.value, props.option)}
          aria-label={getSwatchClass(props.value)}
        ></button>
      )}
    </Fragment>
  )
}

function VariantList(props) {
  return (
    <div className={`flex flex-wrap ${props.isModal ? 'gap-4' : 'gap-3'}`}>
      {props.items.length &&
        props.items.map((item) => (
          <VariantItem
            value={item}
            option={props.option}
            selected={props.selected}
            selectableValues={props.selectableValues}
            setSelected={props.setSelected}
            isModal={props.isModal}
          />
        ))}
    </div>
  )
}

function VariantDropdown(props) {
  const onChange = (e) => {
    props.selected = { ...props.selected, [props.option]: e.target.value }
    props.setSelected(props.selected)
  }

  return (
    props.items.length && (
      <select onChange={onChange} className="input !pt-3.5 !pb-2.5">
        {props.items.map((item) => (
          <option value={item} selected={props.selected[props.option] === item}>
            {item}
          </option>
        ))}
      </select>
    )
  )
}

export default ProductVariant
