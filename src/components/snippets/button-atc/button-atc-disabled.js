import Price from 'snippets/price/price'

function ButtonATCDisabled({ text, price }) {
  return (
    <button type="button" className="button-outlined button-large relative mt-4 w-full uppercase" disabled>
      {text} - <Price className="inline" price={price} />
    </button>
  )
}

export default ButtonATCDisabled
