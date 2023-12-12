import { formatMoney as shopifyFormatMoney } from '@shopify/theme-currency'
const settings = window.GM_STATE
const customBadgeTags = settings?.customs?.badge.tags || []
const customBadgeItems = settings?.customs?.badge.items || []

const formatMoney = function (cents, format = settings.shopify.moneyFormat) {
  return shopifyFormatMoney(cents, format)
}

const getProductTitle = (title) => {
  return title
}

const getProductSubtitle = (title) => {
  const textareaEl = document.createElement('textarea')
  textareaEl.innerHTML = title && title.includes('|') ? title.split(' | ')[1] : ''
  return textareaEl.value
}

const getCustomBadgeClass = (tagName) => {
  let tagClass = ''
  if (['new'].includes(tagName)) {
    tagClass = 'badge'
  }
  return tagClass
}

const getBadges = (tags) => {
  const items = []

  if (tags.length) {
    for (const tag of tags) {
      const index = customBadgeTags.findIndex((i) => tag === i)
      if (index !== -1) {
        items.push(customBadgeItems[index])
      } else {
        if (tag.includes('label-')) {
          const tagName = tag.replace('label-', '')
          items.push({
            text: tagName,
            tag,
            customClass: getCustomBadgeClass(tagName),
            backgroundColor: '',
            textColor: ''
          })
        }
      }
    }
  }

  return items
}

export { formatMoney, getProductTitle, getProductSubtitle, getBadges, getCustomBadgeClass }
