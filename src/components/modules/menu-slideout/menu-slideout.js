import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { select, removeClass } from 'helpers/dom'

const selectors = {
  MENU_LIST_SELECTOR: '.js-menu-list',
  MENU_TRIGGER_SELECTOR: '.js-menu-trigger',
  SUB_MEGA_CLASS: 'is-sub-mega',
  SUB_MEGA_ACTIVE_CLASS: 'is-sub-active',
  SUB_MEGA_ACTIVE_SELECTOR: '.is-sub-active',
  SUB_MEGA_CLOSEST_CLASS: '.js-sub-menu-slideout',
  IS_ACTIVE_CLASS: 'is-active',
  IS_ACTIVE_SELECTOR: '.is-active',
  IS_MEGA_CLASS: 'is-mega',
  OPEN_SLIDEOUT_CLASS: 'open-slideout'
}

class MenuSlideout extends HTMLElement {
  constructor() {
    super()
    this.menuList = this.querySelector(selectors.MENU_LIST_SELECTOR)
    this.menuTrigger = document.querySelectorAll(selectors.MENU_TRIGGER_SELECTOR)
    this.open = false

    this.attachEvent()
    this.observeClass()
  }

  attachEvent() {
    this.menuTrigger.forEach((item) => {
      item.addEventListener('click', (e) => {
        if (this.open) {
          this.closeDrawer()
          item.classList.remove(selectors.IS_ACTIVE_CLASS)
          this.closeMenuSlideout()
        } else {
          this.openDrawer(e)
          item.classList.add(selectors.IS_ACTIVE_CLASS)
        }
      })
    })
  }

  openDrawer(event) {
    if (event && event.preventDefault) {
      if (event.metaKey) {
        return
      }
      event.preventDefault()
    }

    this.classList.add(selectors.OPEN_SLIDEOUT_CLASS)
    disableBodyScroll(this.menuList)
    this.open = true
  }

  closeDrawer() {
    this.menuTrigger.forEach((item) => {
      item.classList.remove(selectors.IS_ACTIVE_CLASS)
    })
    this.classList.remove(selectors.OPEN_SLIDEOUT_CLASS)
    this.open = false
    setTimeout(() => clearAllBodyScrollLocks(), 500)
  }

  observeClass() {
    const config = { attributes: true, childList: true, characterData: true, subtree: true, attributeOldValue: true }

    const callback = (mutationList) => {
      for (const mutation of mutationList) {
        if (mutation.attributeName === 'class') {
          if (
            mutation.target.localName !== this.localName &&
            !(mutation.target.className.includes(selectors.IS_MEGA_CLASS) && !mutation.target.className.includes(selectors.IS_ACTIVE_CLASS))
          ) {
            if (mutation.target.className.includes(selectors.SUB_MEGA_CLASS) && !mutation.target.className.includes(selectors.SUB_MEGA_ACTIVE_CLASS)) {
              disableBodyScroll(mutation.target.closest(selectors.SUB_MEGA_CLOSEST_CLASS))
            } else {
              for (let i = 0; i < mutation.target.children.length; i++) {
                if (mutation.target.children[i].localName === 'div') {
                  disableBodyScroll(mutation.target.children[i])
                }
              }
            }
          } else {
            disableBodyScroll(this.menuList)
          }
        }
      }
    }

    const observer = new MutationObserver(callback)
    observer.observe(this, config)
  }

  closeMenuSlideout() {
    const isMenuActive = select(selectors.IS_ACTIVE_SELECTOR, this)
    const isSubMenuActive = select(selectors.SUB_MEGA_ACTIVE_SELECTOR, this)

    this.menuList.scrollTop = 0
    if (isMenuActive) {
      isMenuActive.lastChild.scrollTop = 0
      removeClass(selectors.IS_ACTIVE_CLASS, isMenuActive)
    }
    if (isSubMenuActive) {
      isSubMenuActive.lastChild.scrollTop = 0
      removeClass(selectors.SUB_MEGA_ACTIVE_CLASS, isSubMenuActive)
    }
  }
}

customElements.define('menu-slideout', MenuSlideout)
