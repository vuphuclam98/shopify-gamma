import { Fragment } from 'preact'
import { useEffect, useRef } from 'preact/hooks'
import { selectAll, on } from '@/components/helpers/dom'
import Icon from 'snippets/icon/icon'

function ProductStatus({ productData, tags = [], id, available, isGiftCard, afterpayEnable, hideStatus = false }) {
  const infoButtonRef = useRef(null)

  const isComingSoon = tags.some((item) => item === 'coming-soon')

  useEffect(() => {
    const MODAL_SELECTOR = 'modal-dialog'
    const modalEls = selectAll(MODAL_SELECTOR)
    on(
      'click',
      (e) => {
        const targetElement = infoButtonRef.current
        if (targetElement && targetElement.id) {
          modalEls.find((modal) => modal.dataset.target === targetElement.id).show()
        } else {
          modalEls.find((modal) => modal.dataset.target === e.target.id).show()
        }
      },
      infoButtonRef.current
    )
  }, [])

  const translate = window.pdpState.translates

  return (
    <Fragment>
      {!isGiftCard && (
        <div className="flex items-center">
          {!hideStatus &&
            (available && !isComingSoon ? (
              <div className="mr-4 flex items-center">
                <Icon className="mr-2 h-4 w-4 text-secondary" name="icon-checkmark-outline" viewBox="0 0 16 16" />
                <span className="text-sm">Available</span>
              </div>
            ) : isComingSoon ? (
              <div className="mr-4 flex items-center">
                <Icon className="mr-2 mb-0.5 h-4 w-4 text-warning-content" name="icon-info" viewBox="0 0 18 18" />
                <span className="text-sm">{translate.comingSoon}</span>
              </div>
            ) : (
              <div className="mr-4 flex items-center">
                <Icon className="mr-2 mb-0.5 h-4 w-4 text-error-content" name="icon-close-outline" viewBox="0 0 16 16" />
                <span className="text-sm">{translate.soldOut}</span>
              </div>
            ))}

          {afterpayEnable && (
            <div className="flex items-center">
              <Icon className="mr-2 h-4 w-4 text-secondary" name="icon-card" viewBox="0 0 16 16" />
              <span className="text-sm">{translate.buyNowPayLate}</span>
              <button className="link js-modal-dialog-trigger ml-1 text-info-content" id="afterpay-slideout" ref={infoButtonRef}>
                {translate.info}
              </button>
            </div>
          )}
        </div>
      )}
    </Fragment>
  )
}

export default ProductStatus
