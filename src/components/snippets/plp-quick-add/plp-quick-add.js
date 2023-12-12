/* global globalEvents */
import { Fragment } from 'preact'
import { useMemo, useState } from 'preact/hooks'
import { addCartItem } from 'helpers/cart'
import { eventProps } from 'helpers/global'
import { formatMoney } from 'uses/useShopify'
import PlpQuickAddModal from 'snippets/plp-quick-add-modal/plp-quick-add-modal'
import LoaderSpin from 'snippets/loader-spin/loader-spin'

function PlpQuickAdd({ available, variants, options, isMiniCart = false }) {
  const [isAdding, setIsAdding] = useState(false)
  const [activeModal, setActiveModal] = useState(false)

  const isOnlyVariantDefault = useMemo(() => {
    return variants.length === 1 && variants[0].title === 'Default Title'
  }, [])
  const currentVariant = useMemo(() => variants.length > 0 && variants[0], [variants])
  const buttonTextAvailable = useMemo(() => (isMiniCart ? `<b>Add</b> (${formatMoney(currentVariant.price)})` : 'Add to bag'), [isMiniCart, currentVariant])
  const buttonText = useMemo(() => (available ? buttonTextAvailable : 'Sold out'), [available])

  const addToCart = async () => {
    setIsAdding(true)
    const properties = {}
    const cartItem = await addCartItem(currentVariant.id, properties, 1)
    if (cartItem) {
      globalEvents.emit(eventProps.cart.add, cartItem)
    }
    setIsAdding(false)
  }

  const openModal = () => {
    setActiveModal(true)
  }

  return (
    <Fragment>
      {isOnlyVariantDefault ? (
        <button
          type="button"
          className="button-outlined plp-card-button relative mt-3 w-full text-sm tracking-normal md:text-base 3xl:mt-4"
          disabled={!available}
          onClick={addToCart}
        >
          {isAdding ? <LoaderSpin /> : <span dangerouslySetInnerHTML={{ __html: buttonText }}></span>}
        </button>
      ) : (
        <div>
          <button
            className="button-outlined plp-card-button mt-3 w-full text-sm tracking-normal md:text-base 3xl:mt-4"
            disabled={!available}
            onClick={openModal}
          >
            <span dangerouslySetInnerHTML={{ __html: buttonText }}></span>
          </button>
          <PlpQuickAddModal
            isMiniCart={isMiniCart}
            activeModal={activeModal}
            variants={variants}
            options={options}
            setActiveModal={setActiveModal}
          ></PlpQuickAddModal>
        </div>
      )}
    </Fragment>
  )
}

export default PlpQuickAdd
