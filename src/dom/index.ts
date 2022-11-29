import { DOMConfig } from '../types/index'
import { reportEvent } from '../utils/index'

const eventPrefix = 'data-event'
const exposePrefix = 'data-expose'

export default class DomWatcher {
  private domConfig: DOMConfig
  private url: string

  constructor (url: string, domConfig: DOMConfig) {
    this.url = url
    this.domConfig = Object.assign(this.normalizeDomConfig(), domConfig)
    this.eventWatcher()
    this.visibilityWatcher()
  }

  private normalizeDomConfig() {
    return <DOMConfig>{
      visibility: true,
      root: document.documentElement,
      threshold: 0.2,
      event: true,
      eventListeners: ['click']
    }
  }

  private eventWatcher() {
    if (this.domConfig.event === false) return

    const { root } = this.domConfig

    if (!root) return

    this.domConfig.eventListeners.forEach((eventType) => {
      root.addEventListener(
        eventType,
        (e) => {
          const target = e.target as HTMLElement
          if (!target.hasAttribute(`${eventPrefix}`)) return

          const value = target.getAttribute(`${eventPrefix}`) || ''
          reportEvent(this.url, eventType, value)
        },
        {
          capture: true
        }
      )
    })
  }

  private visibilityWatcher() {
    const { root, threshold } = this.domConfig

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const { intersectionRatio, target } = entry

          if (!target.hasAttribute(`${exposePrefix}`)) return

          if (intersectionRatio >= threshold) {
            const value = target.getAttribute(`${exposePrefix}`) || ''
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
      if (node.hasAttribute(`${exposePrefix}`)) {
        observer.observe(node)
      }

      if (node.children.length) {
        this.traverseNode(node as HTMLElement, observer)
      }
    }
  }
}