import { Config, DOMConfig } from './types/index'

export default class WebMonitor {
  public config: Config
  public domConfig: DOMConfig

  constructor(config: Config) {
    this.config = Object.assign(this.normalizeConfig(), config)
    this.domConfig = this.normalizeDomConfig()
    window.$monitorConfig = this.config

    this.config.jsError && this.createJsErrorMonitor()
  }

  private normalizeConfig() {
    return <Config>{
      domMonitor: false,
      jsError: false
    }
  }

  private normalizeDomConfig() {
    return <DOMConfig>{
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
  public reportEvent(key: string, value: object | string | null, type?: string) {
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
  public createDOMMonitor(domConfig: DOMConfig) {
    if (this.config.domMonitor === false) return

    this.domConfig = Object.assign(this.domConfig, domConfig)
    this.eventMonitor()
    this.visibilityMonitor()
    return this
  }

  private eventMonitor() {
    if (this.domConfig.event === false) return

    const { root } = this.domConfig

    if (!root) return

    this.domConfig.eventListeners.forEach((eventType) => {
      root.addEventListener(
        eventType,
        (e) => {
          const target = e.target as HTMLElement
          const value = target.getAttribute('data-click')
          this.reportEvent(eventType, value)
        },
        {
          capture: true
        }
      )
    })
  }

  private visibilityMonitor() {
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

  private traverseNode(
    root: HTMLElement | null,
    observer: IntersectionObserver
  ) {
    if (!root) return

    for (const node of root.children) {
      if (node.hasAttribute('data-expose')) {
        observer.observe(node)
      }

      if (node.children.length) {
        this.traverseNode(node as HTMLElement, observer)
      }
    }
  }

  private createJsErrorMonitor () {
    window.addEventListener('error', e => {
      const {
        message,
        type,
        lineno,
        colno,
        error
      } = e
      this.reportEvent(type, {
        message,
        lineno,
        colno,
        stack: error.stack
      })
    })

    window.addEventListener('unhandledrejection', e => {
      this.reportEvent(e.type, {
        reason: e.reason
      })
    })
  }
}
