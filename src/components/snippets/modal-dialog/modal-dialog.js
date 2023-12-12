import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { on, addClass, selectAll } from 'helpers/dom'
import { map } from 'helpers/utils'

const selectors = {
  closeClass: '.js-close-modal-dialog',
  contentClass: '.js-content-modal-dialog',
  openClass: 'modal-dialog-opened',
  overlayClass: 'modal-dialog-overlay',
  validateForm: 'validate-form'
}

class ModalDialog extends HTMLElement {
  constructor() {
    super()

    this.init()
  }

  init() {
    this.closeBtn = this.querySelectorAll(selectors.closeClass)
    this.contentEl = this.querySelector(selectors.contentClass)
    this.isSlideOut = this.dataset && this.dataset.type === 'slideout'
    this.scrollTarget = this.getAttribute('data-scroll-target')
    this.attachEvents()
    this.addOverlay()
  }

  attachEvents() {
    this.closeBtn.forEach((btn) => on('click', this.hide.bind(this), btn))
    on('click', this.hide.bind(this), this)
    this.contentEl && on('click', (e) => e.stopPropagation(), this.contentEl)
    on(
      'keyup',
      (event) => {
        if (event.code.toUpperCase() === 'ESCAPE') this.hide()
      },
      this
    )
  }

  addOverlay() {
    if (this.isSlideOut) {
      this.overlayEl = document.createElement('div')
      addClass(selectors.overlayClass, this.overlayEl)
      this.insertBefore(this.overlayEl, this.contentEl)
    }
  }

  show(target, init = false) {
    init && this.init()
    /** Hide all opened modal before open new modal */
    const allModals = document.querySelectorAll(selectors.openClass)
    allModals.forEach((modal) => modal.hide())

    this.setAttribute('open', '')
    this.classList.add(selectors.openClass)

    if (!target) {
      const scrollTargetEl = selectAll(this.scrollTarget, this)
      map(disableBodyScroll, [...scrollTargetEl, this.contentEl])
    } else {
      disableBodyScroll(target)
    }
  }

  hide() {
    /** Refresh validate form when hide modal */
    const allFormsValidate = this.querySelectorAll(selectors.validateForm)
    allFormsValidate.forEach((form) => form.refreshValidate())

    this.removeAttribute('open')
    this.classList.remove(selectors.openClass)
    clearAllBodyScrollLocks()
  }
}

customElements.define('modal-dialog', ModalDialog)
