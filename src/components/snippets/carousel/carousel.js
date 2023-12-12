import { addClass, removeClass, select, selectAll } from 'helpers/dom'

const selectors = {
  TRACK_SELECTOR: '.carousel-track',
  DOTS_SELECTOR: '.carousel-dots',
  NEXT_BUTTON_SELECTOR: 'button[data-direction="next"]',
  PREV_BUTTON_SELECTOR: 'button[data-direction="prev"]',
  BUTTON_DISALBED_CLASS: 'carousel-button-disable',
  ITEM_ACTIVE_CLASS: 'carousel-dots-item-active',
  DOT_ITEM_SELECTOR: '.carousel-dots-item',
  ITEM_SELECTOR: '.carousel-item',
  HIDDEN_CLASS: 'hidden'
}

class Carousel extends HTMLElement {
  constructor() {
    super()
    this.track = select(selectors.TRACK_SELECTOR, this)
    this.dotsWrap = select(selectors.DOTS_SELECTOR, this)
    this.dots = null
    this.currentIndex = 0
    this.slidesCount = this.track.childElementCount
    this.maxIndex = this.track.childElementCount
    this.items = []
    this.slidesPerView = 0
    this.rate = 0
    this.gapViewport = 0
    this.offscreenWidth = 0
    this.drag = {
      press: false,
      startX: 0,
      scrollLeft: 0,
      velX: 0,
      momentumID: null
    }

    this.nextButton = select(selectors.NEXT_BUTTON_SELECTOR, this)
    this.previousButton = select(selectors.PREV_BUTTON_SELECTOR, this)
    this.onKeyup = this.onKeyup.bind(this)
    this.onScroll = this.onScroll.bind(this)
    this.onClickDots = this.onClickDots.bind(this)
    this.attachEventDrag = this.attachEventDrag.bind(this)

    this.init()
    this.initNavigation()
    this.attachEventDrag()

    const resizeObserver = new ResizeObserver((entries) => this.init())
    resizeObserver.observe(this.track)
  }

  init() {
    if (this.track && this.track.children.length > 0) {
      const trackParentEl = this.track.parentElement
      this.rate = this.getRateChild(this.track.children, this.getOffsetWidth(trackParentEl))
      this.offscreenWidth = this.getOffScreen(this.track.children, this.getOffsetWidth(trackParentEl))
      this.gapViewport = this.getGapViewport(this.track)
      this.slidesPerView = Math.floor(1 / this.rate)
      this.maxIndex = this.track.children.length - this.slidesPerView + 1
      const enable = this.checkEnable(this.track.children, this.getOffsetWidth(trackParentEl))

      if (enable) {
        this.initDots()
        this.attachEvent()
      } else {
        this.destroy()
      }
    } else if (this.track) {
      this.watchContent(this.track)
    }
  }

  attachEventDrag() {
    this.track.addEventListener('mousedown', this.onMouseDown.bind(this))
    this.track.addEventListener('mouseleave', this.onMouseLeave.bind(this))
    this.track.addEventListener('mouseup', this.onMouseUp.bind(this))
    this.track.addEventListener('mousemove', this.onMouseMove.bind(this))
    this.track.addEventListener('wheel', this.onMouseWheel.bind(this))
  }

  onMouseDown(e) {
    this.drag.press = true
    this.drag.startX = e.pageX - this.track.offsetLeft
    this.drag.scrollLeft = this.track.scrollLeft
  }

  onMouseLeave(e) {
    this.drag.press = false
    this.track.classList.remove('on-drag')
  }

  onMouseUp(e) {
    this.drag.press = false
    this.track.classList.remove('on-drag')
  }

  onMouseMove(e) {
    e.preventDefault()
    if (this.drag.press) {
      if (!this.track.classList.contains('on-drag')) {
        this.track.classList.add('on-drag')
      }

      const delta = this.drag.startX - e.pageX

      this.track.scrollLeft = this.drag.scrollLeft + delta
    }
  }

  onMouseWheel(e) {}

  attachEvent() {
    if (this.track.firstElementChild) {
      this.items = [...this.track.children]
      this.track.addEventListener('scroll', this.onScroll.bind(this))
    }
  }

  initNavigation() {
    if (this.slidesCount === this.slidesPerView) {
      addClass(selectors.HIDDEN_CLASS, this.previousButton)
      addClass(selectors.HIDDEN_CLASS, this.nextButton)
    } else {
      addClass(selectors.BUTTON_DISALBED_CLASS, this.previousButton)
      removeClass('hidden', this.nextButton.parentElement)

      this.previousButton.removeEventListener('click', this.previous)
      this.previousButton.addEventListener('click', this.previous.bind(this))

      this.nextButton.removeEventListener('click', this.next)
      this.nextButton.addEventListener('click', this.next.bind(this))
    }
  }

  initDots() {
    if (this.dotsWrap && this.maxIndex > 1) {
      this.dotsWrap.innerHTML = ''

      for (let index = 0; index < this.maxIndex; index++) {
        const dot = document.createElement('div')
        dot.classList.add('carousel-dots-item')
        dot.setAttribute('data-index', index)

        if (this.currentIndex === index) {
          dot.classList.add(selectors.ITEM_ACTIVE_CLASS)
        }

        dot.addEventListener('click', this.onClickDots)

        this.dotsWrap.appendChild(dot)
      }
    }
  }

  updateDotsActive(index) {
    if (this.dotsWrap) {
      const items = selectAll(selectors.DOT_ITEM_SELECTOR, this.dotsWrap)
      items.forEach((item) => {
        if (parseInt(item.getAttribute('data-index')) === index) {
          addClass(selectors.ITEM_ACTIVE_CLASS, item)
        } else {
          removeClass(selectors.ITEM_ACTIVE_CLASS, item)
        }
      })
    }
  }

  updateNavigation(index) {
    if (index === this.maxIndex - 1) {
      addClass(selectors.BUTTON_DISALBED_CLASS, this.nextButton)
    } else {
      removeClass(selectors.BUTTON_DISALBED_CLASS, this.nextButton)
    }
    if (index === 0) {
      addClass(selectors.BUTTON_DISALBED_CLASS, this.previousButton)
    } else {
      removeClass(selectors.BUTTON_DISALBED_CLASS, this.previousButton)
    }
  }

  getRateChild(items, totalWidth) {
    return this.getOffsetWidth(items[0]) / totalWidth
  }

  getOffScreen(items, totalWidth) {
    return this.getOffsetWidth(items[0]) * items.length - totalWidth
  }

  onKeyup(e) {
    switch (e.key) {
      case 'ArrowLeft':
        return this.setIndex(this.currentIndex - 1)
      case 'ArrowRight':
        return this.setIndex(this.currentIndex + 1)
    }
  }

  onScroll() {
    for (let index = 0; index < this.items.length; index++) {
      const item = this.items[index]
      if (Math.abs(this.track.scrollLeft - item.offsetLeft) < 10) {
        this.currentIndex = index
        this.updateNavigation(index)
        this.updateDotsActive(index)
        this.getCurrentIndex(index)
        break
      }
    }
  }

  checkEnable(items, totalWidth) {
    return (this.getOffsetWidth(items[0]) * items.length) / totalWidth > 1
  }

  previous() {
    let index = this.currentIndex - 1
    if (this.currentIndex === 0) index = 0

    this.setIndex(index)
  }

  next() {
    let index = this.currentIndex + 1

    if (this.currentIndex === this.maxIndex - 1) index = this.maxIndex - 1

    this.setIndex(index)
  }

  scroll(index) {
    const item = this.items[index]
    if (item) {
      let offsetLeft = item.offsetLeft
      if (index === 0) offsetLeft = 0

      this.track.scrollLeft = offsetLeft
    }
  }

  onClickDots(e) {
    const target = e.target
    if (target) {
      const index = parseInt(target.getAttribute('data-index'))
      this.setIndex(index)
    }
  }

  setIndex(index) {
    if (index < 0) {
      this.currentIndex = 0
    } else if (index > this.maxIndex) {
      this.currentIndex = this.maxIndex
    } else {
      this.currentIndex = index
    }

    this.scroll(index)
  }

  getOffsetWidth(el) {
    return el.getBoundingClientRect().width
  }

  getOffsetLeft(el) {
    return el.getClientRects()[0].x - this.gapViewport
  }

  getGapViewport(el) {
    const computedStyle = getComputedStyle(el)

    return parseFloat(computedStyle.paddingLeft) > 0 ? parseFloat(computedStyle.paddingLeft) : el.getBoundingClientRect().left
  }

  getViewport(el) {
    const computedStyle = getComputedStyle(el)
    let elWidth = el.clientWidth
    elWidth -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight)

    return elWidth
  }

  watchContent(el) {
    const config = { attributes: true, childList: true, subtree: true }

    const callback = (mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
          console.log('A child node has been added or removed.')
        } else if (mutation.type === 'attributes') {
          console.log(`The ${mutation.attributeName} attribute was modified.`)
        }
      }
    }

    const observer = new MutationObserver(callback)
    observer.observe(el, config)
    observer.disconnect()
  }

  destroy() {
    if (this.dotsWrap) {
      this.dotsWrap.innerHTML = ''
    }
  }

  getCurrentIndex(index) {
    this.dispatchEvent(
      new CustomEvent('change-index', {
        detail: index
      })
    )
  }
}

customElements.define('carousel-main', Carousel)
