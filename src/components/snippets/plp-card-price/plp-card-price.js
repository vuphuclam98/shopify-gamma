import Price from 'snippets/price/price'

function PlpCardPrice({ price, originalPrice }) {
  return (
    <Price
      price={price}
      originalPrice={originalPrice}
      className="plp-card-price mt-1 flex flex-row-reverse justify-center gap-2 md:mt-3"
      classSize="text-lg text-grey-700"
    />
  )
}

export default PlpCardPrice
