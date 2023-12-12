import Price from 'snippets/price/price'
import LoaderSpin from 'snippets/loader-spin/loader-spin'

function CartTotal(props) {
  return (
    <div className="flex justify-between pb-4">
      <span className="text-grey-900">Total</span>
      <div className="relative flex">
        <LoaderSpin show={props.fetching} />
        <Price price={props.price} className="inline-block text-grey-900" classSize="text-base" />
      </div>
    </div>
  )
}

export default CartTotal
