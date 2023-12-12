import CartShipping from 'snippets/cart-shipping/cart-shipping'
import CartCheckout from 'snippets/cart-checkout/cart-checkout'
import CartTotal from 'snippets/cart-total/cart-total'

function MiniCartButton({ cart, fetching }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 bg-white">
      <CartShipping className="border-y border-default bg-grey-100 py-[7px] px-4 text-xs" type="mini-cart" totalPrice={cart.total_price} />
      <div className="p-4 md:px-6 md:pt-5 md:pb-6">
        <CartTotal price={cart.total_price} fetching={fetching} />
        <CartCheckout type="mini-cart" className="flex gap-4" />
      </div>
    </div>
  )
}

export default MiniCartButton
