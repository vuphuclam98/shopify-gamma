import { useState } from 'preact/hooks'
import { postBeaconTracking } from 'uses/useSearchspringTracking'
import { redirect } from 'uses/useSearchspringUtils'
import { getBadges, getProductSubtitle } from 'uses/useShopify'
import Badge from 'snippets/badge/badge'
import Image from 'snippets/image/image'
import Icon from 'snippets/icon/icon'
import PlpCardPrice from 'snippets/plp-card-price/plp-card-price'
import PlpQuickAdd from 'snippets/plp-quick-add/plp-quick-add'

function PlpCard({
  className = 'relative flex flex-col p-3 pb-4 border-b md:p-2 md:pb-6 xl:p-4 xl:pb-8 border-default lg:relative lg:overflow-hidden plp-card',
  title,
  subtitle,
  url,
  handle,
  imageUrl,
  alt = '',
  secondImageUrl,
  available,
  variants,
  options,
  tags = [],
  price,
  originalPrice,
  intellisuggestData,
  intellisuggestSignature,
  isInCart = false,
  isMiniCart = false,
  showQuickAdd = true,
  collectionClickTracking = null,
  beaconClickTracking = null,
  isHoverSwapImage = true,
  collectionHandle
}) {
  const badges = getBadges(tags)

  const [isHover, setIsHover] = useState(false)

  const [isLoaded, setIsLoaded] = useState(false)

  const templateName = window.GM_STATE.shopify.templateName

  const productUrl = templateName === 'collection' && collectionHandle ? `collections/${collectionHandle}/products` : 'products'

  const hasSecondImage = isHoverSwapImage && secondImageUrl && secondImageUrl.length > 1

  const renderButton = () => showQuickAdd && <PlpQuickAdd isMiniCart={isMiniCart} available={available} variants={variants} options={options}></PlpQuickAdd>

  const onTracking = async (e) => {
    e.preventDefault()
    if (intellisuggestData && intellisuggestSignature && collectionClickTracking) {
      collectionClickTracking(url, intellisuggestData, intellisuggestSignature)
      redirect(`${productUrl}`, handle, e.ctrlKey)
    } else if (beaconClickTracking) {
      const result = await postBeaconTracking(beaconClickTracking)
      if (result) {
        redirect(`${productUrl}`, handle, e.ctrlKey)
      }
    } else {
      redirect(`${productUrl}`, handle, e.ctrlKey)
    }
  }

  const showSecondImage = () => {
    if (hasSecondImage) {
      setIsLoaded(true)
      setIsHover(true)
    }
  }

  const hideSecondImage = () => {
    setIsHover(false)
  }

  return (
    <div className={className} onMouseEnter={() => showSecondImage()} onMouseLeave={() => hideSecondImage()}>
      {isInCart === true && <InCartLabel />}
      <div className="plp-card-image relative mb-5 md:mb-7">
        <a className={'cy-product-card'} href={`/${productUrl}/${handle}`} title={title} onClick={onTracking}>
          <Image
            imageUrl={imageUrl}
            alt={alt}
            className="aspect-[1/1]"
            imageClass="w-full h-full"
            imageBreakpoints="(min-width: 768px)|(min-width: 0px)"
            isCover={false}
            isLazy={true}
            key={handle}
          />
          {isLoaded && hasSecondImage && (
            <Image
              imageUrl={[secondImageUrl[1]]}
              alt={alt}
              className={`!absolute top-0 left-0 aspect-[1/1] bg-white opacity-0 transition-opacity duration-300 ease-[ease] ${isHover ? '!opacity-100' : ''}`}
              imageClass="w-full h-full rounded-2xl overflow-hidden"
              imageBreakpoints="(min-width: 768px)|(min-width: 0px)"
              isCover={false}
              isLazy={true}
            />
          )}
        </a>
        <Badge items={badges} className="plp-card-badge pointer-events-none absolute -bottom-3 flex w-full flex-wrap justify-center gap-2" />
      </div>
      <div className="plp-card-title mb-1 flex-1 text-center md:px-4">
        <h3>
          <a
            href={`/${productUrl}/${handle}`}
            title={title}
            className="plp-card-title-link text-sm font-bold !tracking-normal text-grey-900 md:text-base"
            onClick={onTracking}
            dangerouslySetInnerHTML={{ __html: title }}
          ></a>
        </h3>
      </div>
      <div className="plp-card-content flex flex-col md:px-4">
        <span className="plp-card-variant mb-1 text-center text-sm tracking-normal text-grey-500 md:text-sm">{getProductSubtitle(subtitle)}</span>
        <PlpCardPrice price={price} originalPrice={originalPrice} />
        {renderButton()}
      </div>
    </div>
  )
}

function InCartLabel() {
  const translate = window.plpState.translates

  return (
    <div className="absolute top-0 left-0 z-10 flex w-full items-center justify-center bg-default p-2 text-white">
      <Icon name="icon-success-2" className="mr-1 h-3 w-3 text-white" viewBox="0 0 20 20" />
      <span className="text-xs font-bold">{translate.inCartLabel}</span>
    </div>
  )
}

export default PlpCard
