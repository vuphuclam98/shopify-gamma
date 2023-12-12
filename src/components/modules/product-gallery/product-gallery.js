import { select, selectAll, on, addClass, removeClass } from 'helpers/dom'
import { map } from 'helpers/utils'

const selectors = {
  MODAL_ZOOM_SELECTOR: 'modal-dialog',
  GALLERY_ITEM_SELECTOR: '.js-gallery-item',
  GALLERY_ZOOM_MAIN_SELECTOR: '.js-gallery-zoom-main carousel-main',
  GALLERY_ZOOM_THUMB_ITEM_SELECTOR: '.js-zoom-thumb-item',
  GALLERY_THUMB_ACTIVE_CLASS: 'is-active'
}

export default class ProductGallery extends HTMLElement {
  constructor() {
    super()

    this.modalZoom = select(selectors.MODAL_ZOOM_SELECTOR, this)
    this.galleryItems = selectAll(selectors.GALLERY_ITEM_SELECTOR, this)
    this.mainGalleryZoom = select(selectors.GALLERY_ZOOM_MAIN_SELECTOR, this)
    this.thumbGalleryItems = selectAll(selectors.GALLERY_ZOOM_THUMB_ITEM_SELECTOR, this)
  }

  connectedCallback() {
    if (this.hasAttribute('data-enable-zoom')) {
      this.attachEvents()
    }
  }

  attachEvents() {
    map((item) => {
      if (item.dataset.mediaType === 'image') {
        on(
          'click',
          () => {
            this.modalZoom.show()
            this.setThumbActive(item.dataset.mediaId)
          },
          item
        )
      }
    }, this.galleryItems)
    this.onClickThumb()
  }

  setThumbActive(id) {
    map((item) => {
      if (item.dataset.mediaId === id) {
        addClass(selectors.GALLERY_THUMB_ACTIVE_CLASS, item)
        this.setMainActive(item.dataset.index)
      } else removeClass(selectors.GALLERY_THUMB_ACTIVE_CLASS, item)
    }, this.thumbGalleryItems)
  }

  setMainActive(index) {
    this.mainGalleryZoom.scroll(index)
  }

  onClickThumb() {
    map((item) => {
      on(
        'click',
        () => {
          const { mediaId } = item.dataset
          this.setThumbActive(mediaId)
        },
        item
      )
    }, this.thumbGalleryItems)
  }
}

customElements.define('product-gallery', ProductGallery)
