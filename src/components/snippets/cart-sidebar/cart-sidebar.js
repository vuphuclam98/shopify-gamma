import CartShipping from 'snippets/cart-shipping/cart-shipping'
import CartCheckout from 'snippets/cart-checkout/cart-checkout'
import CartTotal from 'snippets/cart-total/cart-total'

function CartSidebar({ cart, fetching }) {
  return (
    <div>
      <CartShipping className="cart-page border-b border-default px-4 py-6 md:px-6" type="cart-page" totalPrice={cart.total_price} />
      <div className="px-4 py-6 md:px-6">
        <CartTotal price={cart.total_price} fetching={fetching} />
        <CartCheckout className="flex" />
      </div>
    </div>
  )
}

export default CartSidebar
