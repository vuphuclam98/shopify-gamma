import { select, on, hasClass, remove, removeClass, addClass, ready } from 'helpers/dom'

const selectors = {
  accountTabHeaderClass: '.js-account-tab-header',
  recoverPageId: '#recover',
  customerLoginId: '#customer_login',
  hiddenClass: 'hidden',
  recoverButtonClass: '.js-recover-button',
  recoverEmailClass: '.js-recover-email',
  isInvalidClass: 'is-invalid',
  inputErrorClass: '.js-recover-email ~ .input-error',
  accountTabSelector: 'account-tab',
  recoverFormActiveClass: 'recover-form-active',
  accountRecoverForm: 'account-recover-form',
  form: 'form',
  accountFormCustom: 'account-form-custom'
}

const accountTabHeaderEl = select(selectors.accountTabHeaderClass)

class AccountRecoverForm extends HTMLElement {
  constructor() {
    super()

    this.buttonEl = select(selectors.recoverButtonClass)
    this.emailEl = select(selectors.recoverEmailClass)

    if (this.buttonEl && this.emailEl) {
      this.addEventSubmit()
      this.setEmailValue()
    }
  }

  setEmailValue() {
    const isInvalid = hasClass(selectors.isInvalidClass, this.emailEl)
    if (isInvalid) {
      this.emailEl.value = sessionStorage.getItem('recoverEmailClass')
    }
  }

  addEventSubmit() {
    on(
      'click',
      () => {
        const errorEl = select(selectors.inputErrorClass)
        errorEl && remove(errorEl)
        sessionStorage.setItem('recoverEmailClass', this.emailEl.value)
      },
      this.buttonEl
    )
  }
}

customElements.define('account-recover-form', AccountRecoverForm)

class AccountRecoverLink extends HTMLElement {
  constructor() {
    super()

    const accountFormCustom = select(selectors.accountFormCustom)
    const recoverForm = select(selectors.recoverPageId)
    const accountRecoverForm = select(selectors.accountRecoverForm, recoverForm)

    this.querySelector('a').addEventListener('click', (event) => {
      event.preventDefault()
      showRecoverPage()
    })

    const showRecoverPage = () => {
      accountFormCustom.classList.add(selectors.hiddenClass)
      accountFormCustom.previousElementSibling.classList.add(selectors.hiddenClass)

      recoverForm.classList.remove(selectors.hiddenClass)
      accountTabHeaderEl && addClass(selectors.hiddenClass, accountTabHeaderEl)
      this.closest(selectors.accountTabSelector).classList.add(selectors.recoverFormActiveClass)

      window.scroll({
        top: 0,
        behavior: 'smooth'
      })
    }

    const checkRecoverPage = () => {
      const url = window.location.href
      const isRecoverPage = url.indexOf(selectors.recoverPageId) !== -1
      isRecoverPage && showRecoverPage()
    }

    checkRecoverPage()

    if (accountRecoverForm.hasAttribute('data-active')) {
      showRecoverPage()
    }
  }
}

customElements.define('account-recover-link', AccountRecoverLink)

class AccountRecoverCancelLink extends HTMLElement {
  constructor() {
    super()

    const form = this.closest('form')
    const customerLoginForm = select(selectors.customerLoginId)
    const accountFormCustom = select(selectors.accountFormCustom)

    this.querySelector('a').addEventListener('click', (event) => {
      event.preventDefault()
      form.classList.add(selectors.hiddenClass)
      accountFormCustom.classList.remove(selectors.hiddenClass)
      customerLoginForm.classList.remove(selectors.hiddenClass)
      accountTabHeaderEl && removeClass(selectors.hiddenClass, accountTabHeaderEl)
      this.closest(selectors.accountTabSelector).classList.remove(selectors.recoverFormActiveClass)
    })
  }
}

customElements.define('account-recover-cancel-link', AccountRecoverCancelLink)

class AccountFormCustom extends HTMLElement {
  constructor() {
    super()

    this.returnLink = localStorage.getItem('return_to')
    this.form = select(selectors.form, this)
    this.attackEvent()
  }

  attackEvent() {
    ready(() => {
      if (this.returnLink) {
        const inputReturn = `<input type="hidden" name="return_to" value="${this.returnLink}">`
        this.form.innerHTML += inputReturn
      }
    })
  }
}

customElements.define('account-form-custom', AccountFormCustom)
