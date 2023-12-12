import { select } from 'helpers/dom'

const selectors = {
  COUNTRY_SELECT_SELECTOR: '[name="address[country]"]',
  PROVINCES_SELECT_SELECTOR: '[name="address[province]"]',
  modalDialogClass: '.js-modal-dialog'
}

class AccountAddressForm extends HTMLElement {
  constructor() {
    super()

    this.countrySelectEl = this.querySelector(selectors.COUNTRY_SELECT_SELECTOR)
    this.provincesSelectEl = this.querySelector(selectors.PROVINCES_SELECT_SELECTOR)
    this.countrySelectEl.onchange = (e) => this.handleOnChangeCountry(e.target)
    this.modal = select(selectors.modalDialogClass)

    this.handleOnChangeCountry(this.countrySelectEl)
    this.initAddress()

    // Hide form after clicking "cancel"
    this.addEventListener('click', (event) => {
      if (event.target.getAttribute('type') === 'reset') {
        this.classList.add('hidden')
        this.modal.hide()
      }
    })
  }

  initAddress() {
    const value = this.countrySelectEl.getAttribute('value')

    if (value) {
      this.countrySelectEl.value = value
      this.countrySelectEl.dispatchEvent(new Event('change'))
    }
  }

  setupSelectProvinces(provinces) {
    if (provinces.length === 0) this.provincesSelectEl.parentElement.classList.add('hidden')
    else {
      const value = this.provincesSelectEl.getAttribute('value')
      this.provincesSelectEl.innerHTML = ''
      provinces.forEach((province) => {
        const opt = document.createElement('option')
        opt.value = province[0]
        opt.innerHTML = province[1]
        this.provincesSelectEl.appendChild(opt)
      })
      if (value) {
        this.provincesSelectEl.value = value
        this.provincesSelectEl.dispatchEvent(new Event('change'))
      }
      this.provincesSelectEl.parentElement.classList.remove('hidden')
    }
  }

  handleOnChangeCountry(target) {
    const selectedOption = target[target.selectedIndex]
    const provincesData = JSON.parse(selectedOption.getAttribute('data-provinces'))

    this.setupSelectProvinces(provincesData)
  }
}

customElements.define('account-address-form', AccountAddressForm)
