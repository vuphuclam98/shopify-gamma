function CartCheckout({ type, className, disabled = false }) {
  const isMiniCart = type === 'mini-cart'
  const translate = cartConfig.translates
  return (
    <div className={className}>
      <button type="submit" name="checkout" className={`button-primary w-full flex-1 ${disabled ? 'button-disabled' : ''}`}>
        {isMiniCart ? translate.checkout : translate.go_to_checkout}
      </button>
      {isMiniCart && (
        <a href="/cart" className="button-outlined flex-1">
          {translate.view_bag}
        </a>
      )}
    </div>
  )
}

export default CartCheckout
