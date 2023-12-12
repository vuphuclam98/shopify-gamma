/* global globalEvents */
import { addCartItem } from 'helpers/cart'
import { Fragment } from 'preact'
import { eventProps } from 'helpers/global'
import { useState, useEffect, useMemo } from 'preact/hooks'
import { select } from 'helpers/dom'
import { initValidate } from 'helpers/validate'
import ProductNotify from 'snippets/product-notify/product-notify'
import ButtonATC from 'snippets/button-atc/button-atc'
import ButtonATCDisabled from 'snippets/button-atc/button-atc-disabled'

const selectors = {
  giftCardForm: '#ProductGiftCard',
  inStoreOnlyTag: 'in-store-only',
  inStoreOnlyText: 'INSTORE ONLY',
  comingSoonTag: 'coming-soon'
}

function ProductATC({ state, buttonClass = '', buttonText, isLogged, priceDiscount, isGiftCard }) {
  const [isAdding, setIsAdding] = useState(false)
  const [validateGiftCard, setValidateGiftCard] = useState(null)
  const [giftCardForm, setGiftCardForm] = useState(null)

  const currentPrice = useMemo(() => {
    return priceDiscount && isLogged ? priceDiscount : state.currentVariant.value.price
  }, [state.currentVariant.value.price])

  const productTags = useMemo(() => state.productData.value && state.productData.value.tags, [state.productData.value])

  const isComingSoon = productTags && productTags.length > 0 && productTags.some((item) => item === selectors.comingSoonTag)

  useEffect(() => {
    if (isGiftCard) {
      setGiftCardForm(select(selectors.giftCardForm))
      setValidateGiftCard(initValidate(select(selectors.giftCardForm), true))
    }
  }, [])

  const addPropertiesByTags = (properties) => {
    if (productTags.length && productTags.includes(selectors.inStoreOnlyTag)) {
      properties[selectors.inStoreOnlyTag] = selectors.inStoreOnlyText
    }
    return properties
  }

  const addToCart = async () => {
    setIsAdding(true)
    let properties = {}

    if (isGiftCard) {
      properties = state.properties.value
    }

    properties = addPropertiesByTags(properties)

    const cartItem = await addCartItem(state.currentVariant.value.id, properties, 1)
    if (cartItem) {
      globalEvents.emit(eventProps.cart.add, cartItem)
    }
    setIsAdding(false)
  }

  const handleAddToCart = () => {
    if (!isGiftCard) {
      addToCart()
    } else {
      validateGiftCard.onSuccess(addToCart)
      if (giftCardForm.requestSubmit) {
        giftCardForm.requestSubmit()
      } else {
        giftCardForm.dispatchEvent(new Event('submit'))
      }
    }
  }

  return (
    <div className="mt-4">
      {state.currentVariant.value.available ? (
        <>
          <ButtonATC text={buttonText} onHandle={handleAddToCart} price={currentPrice} loading={isAdding} buttonClass={buttonClass} />
        </>
      ) : (
        <Fragment>
          <ProductNotify variant={state.currentVariant} product={state.productData} />
          {!isComingSoon && <ButtonATCDisabled text="Out of stock" price={currentPrice} />}
        </Fragment>
      )}
    </div>
  )
}

export default ProductATC
