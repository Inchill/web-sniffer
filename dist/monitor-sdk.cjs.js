'use strict'

class WebMonitor {
  constructor(config) {
    this.config = Object.assign(this.normalizeConfig(), config)
    this.domConfig = this.normalizeDomConfig()
    window.$monitorConfig = this.config
  }
  normalizeConfig() {
    return {
      domMonitor: false
    }
  }
  normalizeDomConfig() {
    return {
      visibility: true,
      root: null,
      threshold: 0.2,
      event: true,
      eventListeners: ['click']
    }
  }
  /**
   * A method to report event.
   * @param key event key
   * @param value event value
   * @param type blob data type
   */
  reportEvent(key, value, type) {
    const url = this.config.sendUrl
    const data = {
      key,
      value
    }
    const blobData = new Blob([JSON.stringify(data)], {
      type: type ? type : 'application/x-www-form-urlencoded'
    })
    navigator.sendBeacon(url, blobData)
  }
  /**
   * Create a DOM observer
   */
  createDOMMonitor(domConfig) {
    if (this.config.domMonitor === false) return
    this.domConfig = Object.assign(this.domConfig, domConfig)
    this.eventMonitor()
    this.visibilityMonitor()
  }
  eventMonitor() {
    if (this.domConfig.event === false) return
    this.domConfig.eventListeners.forEach((eventType) => {
      window.document.body.addEventListener(
        eventType,
        (e) => {
          const target = e.target
          const value = target.getAttribute('data-click')
          this.reportEvent(eventType, value)
        },
        {
          capture: true
        }
      )
    })
  }
  visibilityMonitor() {
    const { root, threshold } = this.domConfig
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const { intersectionRatio, target } = entry
          if (!target.hasAttribute('data-expose')) return
          if (intersectionRatio >= threshold) {
            this.reportEvent('expose', target.getAttribute('data-expose'))
          }
        })
      },
      {
        root,
        threshold
      }
    )
    this.traverseNode(root, observer)
  }
  traverseNode(root, observer) {
    if (!root) return
    for (const node of root.children) {
      if (node.hasAttribute('data-expose')) {
        observer.observe(node)
      }
      if (node.children.length) {
        this.traverseNode(node, observer)
      }
    }
  }
}

module.exports = WebMonitor
