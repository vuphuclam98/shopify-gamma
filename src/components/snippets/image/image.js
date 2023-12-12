import { useEffect, useState } from 'preact/hooks'

function Image({
  imageUrl = [window.GM_STATE.shopify.defaultImage],
  alt,
  className,
  imageClass,
  isLazy = true,
  isCover = true,
  imageSrcSet = [],
  imageBreakpoints = '(min-width: 0px)',
  imageSizes = [100]
}) {
  const [currentImageUrls] = useState(imageUrl)
  const classImage = `${isCover ? 'object-cover' : 'object-contain'} ${isLazy && 'lazy'} ${imageClass}`
  const customClass = `relative ${className}`
  let fallbackImageUrl = currentImageUrls[0]
  let breakpoints = imageBreakpoints.includes('|') ? imageBreakpoints.split('|') : [imageBreakpoints]

  if (currentImageUrls.length <= 1) {
    breakpoints = breakpoints.splice(0, 1)
  } else {
    breakpoints = breakpoints.splice(0, currentImageUrls.length)
    fallbackImageUrl = currentImageUrls[currentImageUrls.length - 1]
  }

  const sizes = imageSizes
    .reduce((arrs, curr, index) => {
      const size = `${breakpoints[index]} ${curr}vw`
      arrs.push(size)
      return arrs
    }, [])
    .join(',')

  useEffect(() => {
    if (window.lazyLoadInstance) {
      window.lazyLoadInstance.update()
    }
  }, [])

  const getSrcSet = (url) => {
    return imageSrcSet.length > 0 ? imageSrcSet.map((srcset) => `${url} ${srcset}w `).join(',') : url
  }

  return (
    <figure className={customClass}>
      <picture>
        {breakpoints.map((breakpoint, index) => (
          <source media={breakpoint} data-srcset={getSrcSet(currentImageUrls[index])} data-size={sizes} />
        ))}
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUCB1j+Pjx438ACX0D04PrXz0AAAAASUVORK5CYII="
          className={classImage}
          data-src={fallbackImageUrl}
          alt={alt}
        />
      </picture>
    </figure>
  )
}

export default Image
