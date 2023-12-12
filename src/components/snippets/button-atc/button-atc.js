import { Fragment } from 'preact'
import LoaderSpin from 'snippets/loader-spin/loader-spin'
import Price from 'snippets/price/price'

function ButtonATC({ text, onHandle, price, loading, disabled = false }) {
  const classCustom = `relative w-full uppercase button-primary ${!disabled ? '' : 'text-grey-400'} button-large`
  return (
    <button aria-label="add to cart" type="button" className={classCustom} disabled={disabled} onClick={() => onHandle()}>
      {loading ? (
        <LoaderSpin />
      ) : (
        <Fragment>
          {text} - <Price className="inline" price={price} />
        </Fragment>
      )}
    </button>
  )
}

export default ButtonATC
