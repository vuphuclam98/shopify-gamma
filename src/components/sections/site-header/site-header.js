import { on, select, addClass, removeClass, getHeight, isIosDevice, selectAll } from 'helpers/dom'
import { disableBodyScroll } from 'body-scroll-lock'
import throttle from 'lodash.throttle'

const selectors = {
  STICKY_CLASS: 'is-sticky',
  searchToggleClass: '.js-search-toggle',
  searchBarClass: '.js-search-bar',
  searchBarInputClass: '.js-search-bar-input',
  searchDropdownClass: '.js-search-dropdown',
  STICKY_TOPBAR_CLASS: '.js-sticky-topbar',
  HEADER_STICKY_CLASS: '.js-header-sticky',
  throttleTime: 100,
  PRODUCT_FORM_CLASS: '.js-product-form',
  ANCHOR_CLASS: '.anchor-section',
  TOP_BAR_SELECTOR: '#shopify-section-topbar',
  HEADER_SELECTOR: '#shopify-section-site-header'
}

class SiteHeader extends HTMLElement {
  constructor() {
    super()

    this.headerSticky = select(selectors.HEADER_STICKY_CLASS)
    this.stickyTopbar = select(selectors.STICKY_TOPBAR_CLASS)
    this.topBarEl = select(selectors.TOP_BAR_SELECTOR)
    this.headerEl = select(selectors.HEADER_SELECTOR)
    this.menuNavigationHeight = 57
    this.topbarHeight = 38
    this.lastScrollTop = 0
    this.headerStickyShowOffset = this.topBarEl ? getHeight(this.topBarEl) + getHeight(this.headerEl) : 0
    this.headerStickyHiddenOffset = this.headerStickyShowOffset - this.menuNavigationHeight
    this.attachEvents()
    this.getOffSetTop()
    this.handleScroll()
    on(
      'scroll',
      throttle(() => {
        this.getOffSetTop()
        this.handleScroll()
      }, selectors.throttleTime),
      window
    )
    on('DOMContentLoaded', this.getOffSetTop.bind(this), document)
    on('resize', throttle(this.getOffSetTop.bind(this), selectors.throttleTime), window)

    if (isIosDevice) {
      addClass('ios-device', document.body)
    }
  }

  attachEvents() {
    const searchToggleEl = select(selectors.searchToggleClass)
    const searchBarEl = select(selectors.searchBarClass)
    const searchBarInputEl = select(selectors.searchBarInputClass)
    searchToggleEl &&
      searchBarEl &&
      on(
        'click',
        () => {
          searchBarEl.style.display = 'block'
          const searchDropdownEl = select(selectors.searchDropdownClass)
          searchDropdownEl && disableBodyScroll(searchDropdownEl)
          searchBarInputEl && searchBarInputEl.focus()
        },
        searchToggleEl
      )
  }

  getOffSetTop() {
    const positionTopOffset = this.offsetTop > this.topbarHeight ? 0 : this.getBoundingClientRect().top
    document.body.style.setProperty('--header-offset-top', `${positionTopOffset}px`)
  }

  handleScroll() {
    const scrollTopValue = window.pageYOffset || document.documentElement.scrollTop
    if (scrollTopValue > this.lastScrollTop) {
      if (scrollTopValue >= this.headerStickyShowOffset) addClass(selectors.STICKY_CLASS, this.headerEl)
    } else {
      if (scrollTopValue <= this.headerStickyHiddenOffset) {
        removeClass(selectors.STICKY_CLASS, this.headerEl)
      }
    }
    this.lastScrollTop = scrollTopValue <= 0 ? 0 : scrollTopValue
  }

  getStickyHeight() {
    let stickyHeight = 0
    const anchorSectionEl = select(selectors.ANCHOR_CLASS)
    const headerStickyHeight = window.innerWidth < 768 ? 56 : 64
    stickyHeight += headerStickyHeight + getHeight(anchorSectionEl)

    return stickyHeight
  }
}
customElements.define('site-header', SiteHeader)
