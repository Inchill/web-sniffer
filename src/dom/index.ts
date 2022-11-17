import { DOMConfig } from '../types/index'
import { reportEvent } from '../utils/index'

export default class DomMonitor {
  private domConfig: DOMConfig
  private url: string

  constructor (url: string, domConfig: DOMConfig) {
    this.url = url
    this.domConfig = Object.assign(this.normalizeDomConfig(), domConfig)
    this.eventMonitor()
    this.visibilityMonitor()
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

  private eventMonitor() {
    if (this.domConfig.event === false) return

    const { root } = this.domConfig

    if (!root) return

    this.domConfig.eventListeners.forEach((eventType) => {
      root.addEventListener(
        eventType,
        (e) => {
          const target = e.target as HTMLElement
          const value = target.getAttribute('data-click') || ''
          reportEvent(this.url, eventType, value)
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
            const value = target.getAttribute('data-expose') || ''
            reportEvent(this.url, 'expose', value)
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
}