import CartItem from 'snippets/cart-item/cart-item'

function CartGrid({ items, setCart, setFetching }) {
  return (
    <div className="flex flex-col px-4 md:px-6">
      {items
        .filter((cartItem) => !cartItem?.properties?.isCartGift)
        .map((cartItem) => (
          <CartItem item={cartItem} setCart={setCart} setFetching={setFetching} />
        ))}
    </div>
  )
}

export default CartGrid
