import { useEffect, useState } from 'preact/hooks'
import {
  updateCartItem,
  removeCartItem,
  updateCart,
  getCartBadges,
  getCartInfo,
  getCartProperties,
  getDisableChangeQuantity,
  getMaxQuantity,
  removeBundlesItem,
  changeQuantityBundlesProduct
} from 'helpers/cart'
import { getProductTitle } from 'uses/useShopify'
import Image from 'snippets/image/image'
import QuantityInput from 'snippets/quantity-input/quantity-input'
import Price from 'snippets/price/price'
import CartInfo from 'snippets/cart-info/cart-info'
import Badge from 'snippets/badge/badge'
import Icon from 'snippets/icon/icon'

function MiniCartItem({ item, setCart, setFetching }) {
  const [quantity, setQuantity] = useState(item.quantity)

  const badges = getCartBadges(item.tags, item.properties)

  const infos = getCartInfo(item)

  const properties = getCartProperties(item.properties)

  const disableChangeQuantity = getDisableChangeQuantity(properties)

  const isBundles = false

  const productTitle = getProductTitle(item.product_title)

  const maxQuantity = getMaxQuantity(item)

  const onRemove = async () => {
    setFetching(true)
    if (!isBundles) {
      await removeCartItem(item.key)
    } else {
      await removeBundlesItem(item)
    }
    const newCart = await updateCart()
    setCart(newCart)
    setFetching(false)
  }

  const onChangeQuantity = async (quantity) => {
    setFetching(true)
    if (!isBundles) {
      await updateCartItem(item.key, quantity)
    } else {
      await changeQuantityBundlesProduct(item, quantity)
    }
    const newCart = await updateCart()
    setCart(newCart)
    setFetching(false)
  }

  useEffect(() => {
    if (item.quantity !== quantity) {
      onChangeQuantity(quantity)
    }
  }, [quantity])

  return (
    <div className="grid grid-cols-[80px_1fr_20px] items-start gap-4 border-t border-default py-4 first:border-t-0 md:py-6">
      <div className="row-span-2">
        <Image imageUrl={[item.featured_image.url]} className="aspect-[1/1]" key={item.id} />
      </div>
      <div className="flex max-w-[172px] flex-col self-start md:max-w-[212px] md:self-center">
        <a href={item.url} className="text-sm text-grey-900" title={item.title}>
          {productTitle}
        </a>
        <CartInfo infos={infos} properties={properties} isGiftCard={item.gift_card || item.product_type === 'Gift card'} />
        <Badge items={badges} className="flex gap-2 pt-2" />
      </div>
      <div className="md:text-right">
        <button type="button" className="link" onClick={onRemove}>
          <Icon className="h-5 w-5 text-grey-700" name="icon-trash" viewBox="0 0 20 20" />
        </button>
      </div>
      <div className="col-span-2 flex items-center justify-between">
        <div>
          <QuantityInput
            key={`${item.id}-${item.quantity}-${isBundles ? quantity : 'normal'}`}
            quantity={item.quantity}
            min="0"
            max={maxQuantity}
            setQuantity={setQuantity}
            disabled={disableChangeQuantity}
          />
        </div>
        <div className="order-1 text-right md:order-none">
          <Price price={item.line_price} originalPrice={item.compare_at_price} className="flex flex-col text-primary" classColor="text-grey-900" />
        </div>
      </div>
    </div>
  )
}

export default MiniCartItem
