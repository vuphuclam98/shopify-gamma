import { loadScript, addClass } from 'helpers/dom'

const selectors = {
  VIDEO_PLAYER_SELECTOR: 'video-player',
  PLAYING_CLASS: 'is-playing'
}
export default class VideoPlayer extends HTMLElement {
  constructor() {
    super()

    this.player = null
    this.status = {
      play: false,
      error: null
    }

    this.elementInsert = document.createElement('div')

    this.settings = {
      type: this.getAttribute('data-video-type').toLowerCase() || 'mp4',
      src: this.getAttribute('src'),
      thumbnail: this.getAttribute('data-thumbnail') || null
    }

    this.options = {
      autoplay: this.hasAttribute('autoplay'),
      controls: this.hasAttribute('controls'),
      playsinline: this.hasAttribute('playsinline'),
      muted: this.hasAttribute('muted'),
      loop: this.hasAttribute('loop'),
      origin: window.location.origin
    }

    if (this.settings.type === 'youtube') this.appendChild(this.elementInsert)

    this.videos = document.querySelectorAll(selectors.VIDEO_PLAYER_SELECTOR)
  }

  connectedCallback() {
    this.load()
  }

  async load() {
    if (this.settings.type !== 'mp4') {
      await this.loadAPI()

      if (this.settings.type === 'youtube') YT.ready(() => this.setupYTPlayer())
      else if (this.settings.type === 'vimeo') this.setupVimeoPlayer()
    } else {
      this.videoEl = document.createElement('video')
      this.videoEl.src = this.settings.src
      this.player = this.videoEl
      this.thumbnailEl = document.createElement('div')
      this.thumbnail = this.thumbnailEl
      this.buildThumbnail()
      this.appendChild(this.videoEl)
      this.setupMP4Player()
    }
  }

  get videoId() {
    if (this.getAttribute('data-external-id')) return this.getAttribute('data-external-id')
    if (/youtu\.?be/.test(this.settings.src)) {
      const patterns = [
        /youtu\.be\/([^#&?]{11})/, // youtu.be/<id>
        /\?v=([^#&?]{11})/, // ?v=<id>
        /&v=([^#&?]{11})/, // &v=<id>
        /embed\/([^#&?]{11})/, // embed/<id>
        /\/v\/([^#&?]{11})/ // /v/<id>
      ]

      for (let i = 0; i < patterns.length; ++i) {
        if (patterns[i].test(this.settings.src)) {
          return patterns[i].exec(this.settings.src)[1]
        }
      }
    }

    if (/^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/.test(this.settings.src)) {
      const parseURL = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/.exec(this.settings.src)
      return parseURL[5]
    }
    return null
  }

  loadAPI() {
    let src = ''

    if (this.settings.type === 'youtube' && !window.YT) {
      src = 'https://www.youtube.com/iframe_api'
    } else if (this.settings.type === 'vimeo' && !window.Vimeo) {
      src = 'https://player.vimeo.com/api/player.js'
    }
    return loadScript(src)
  }

  setupYTPlayer() {
    const options = {
      videoId: this.videoId,
      playerVars: {
        autoplay: this.options.autoplay ? 1 : 0,
        controls: this.options.controls ? 1 : 0,
        height: '100%',
        width: '100%',
        playsinline: this.options.playsinline ? 1 : 0,
        loop: this.options.loop ? 1 : 0
      },
      events: {
        onError: () => {
          this.status.error = new Error('player could not be built')
        },
        onStateChange: (e) => this._onYouTubeStateChange(e),
        onReady: (e) => this._onYoutubeReadyState(e)
      }
    }
    if (YT.loaded) {
      this.player = new window.YT.Player(this.elementInsert, options)
    }
  }

  setupVimeoPlayer() {
    const options = {
      id: this.videoId,
      ...this.options
    }

    this.player = new window.Vimeo.Player(this, options)
    this.player.on('play', () => this.onPlay())
    this.player.on('pause', () => this.onPause())
    this.player.on('ended', () => this.onEnd)
  }

  setupMP4Player() {
    this.player.controls = this.options.controls
    this.player.autoplay = this.options.autoplay
    this.player.playsInline = this.options.playsinline
    this.player.muted = this.options.muted
    this.player.loop = this.options.loop

    this.player.addEventListener('play', () => this.onPlay())
    this.player.addEventListener('pause', () => this.onPause())
    this.player.addEventListener('ended', () => this.onEnd())
  }

  play() {
    if (!this.settings.src) this.status.error = 'No video src'

    if (this.player) {
      if (this.settings.type === 'youtube') this.player.playVideo()
      else this.player.play()
    }
  }

  pause() {
    if (this.player) {
      if (this.settings.type === 'youtube') this.player.pauseVideo()
      else {
        this.player.pause()
      }
    }
  }

  onPlay() {
    this.videos.forEach((video) => {
      if (video !== this && video.status.play) {
        video.pause()
      }
    })
    this.status.play = true
    this.dispatchEvent(new CustomEvent('play'))
    this.hideThumbnail()
    this.classList.add(selectors.PLAYING_CLASS)
  }

  onPause() {
    this.status.play = false
    this.dispatchEvent(new CustomEvent('pause'))
    this.classList.remove(selectors.PLAYING_CLASS)
  }

  onEnd() {
    this.status.play = false
    this.dispatchEvent(new CustomEvent('ended'))
    this.classList.remove(selectors.PLAYING_CLASS)
    if (this.options.loop) {
      this.play()
    }
  }

  _onYouTubeStateChange(e) {
    const stateMap = {
      '-1': 'unstarted',
      0: 'ended',
      1: 'playing',
      2: 'pause',
      3: 'buffering',
      5: 'cued'
    }
    const state = stateMap[e.data.toString()]
    const eventMethodMap = {
      ended: this.onEnd,
      pause: this.onPause,
      playing: this.onPlay
    }
    if (eventMethodMap[state]) {
      const method = eventMethodMap[state]
      if (method) {
        method.call(this)
      }
    }
  }

  _onYoutubeReadyState(e) {
    if (this.options.autoplay) {
      this.player.mute()
      this.player.playVideo()
    }
    if (this.options.muted) {
      this.player.mute()
    }
  }

  buildThumbnail() {
    if (this.settings.thumbnail) {
      const thumbnailContent = `
        <img src="${this.settings.thumbnail}" class="w-full h-full object-cover" loading="lazy" alt="" />
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" class="w-16 h-16 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1]">
          <path stroke="#FFFFFF" stroke-miterlimit="10" stroke-width="2" d="M56 32C56 18.75 45.25 8 32 8S8 18.75 8 32s10.75 24 24 24 24-10.75 24-24Z"/>
          <path fill="#FFFFFF" d="m27.04 41.805 14.306-8.642a1.362 1.362 0 0 0 0-2.325L27.04 22.195A1.348 1.348 0 0 0 25 23.36v17.282a1.348 1.348 0 0 0 2.04 1.164Z"/>
        </svg>
      `
      addClass('relative', this)
      this.thumbnail.classList.add('absolute', 'inset-0', 'z-[1]', 'pointer-events-none')
      this.thumbnail.innerHTML = thumbnailContent
      this.appendChild(this.thumbnail)
    }
  }

  hideThumbnail() {
    addClass('hidden', this.thumbnail)
  }
}

customElements.define('video-player', VideoPlayer)
