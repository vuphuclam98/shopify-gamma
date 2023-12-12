import MiniCartItem from 'snippets/mini-cart-item/mini-cart-item'

function MiniCartList({ items, setCart, isFetching, setFetching }) {
  return (
    <div className="flex flex-col border-t border-default px-4 md:px-6">
      {items.map((cartItem) => (
        <MiniCartItem item={cartItem} setCart={setCart} isFetching={isFetching} setFetching={setFetching} />
      ))}
    </div>
  )
}

export default MiniCartList
