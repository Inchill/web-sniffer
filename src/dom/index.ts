import { DomConfig, DomReportCallback } from '../types/index'

const eventPrefix = 'data-event'
const exposePrefix = 'data-expose'

class DomWatcher {
  private domConfig: DomConfig
  private onReport: DomReportCallback

  constructor (domConfig: DomConfig, onReport: DomReportCallback) {
    this.domConfig = Object.assign(this.normalizeDomConfig(), domConfig)
    this.onReport = onReport

    this.domConfig.visibility && this.visibilityWatcher()
    this.domConfig.event && this.eventWatcher()
  }

  private normalizeDomConfig() {
    return <DomConfig>{
      visibility: false,
      root: document.documentElement,
      threshold: 0.2,
      event: false,
      eventListeners: ['click']
    }
  }

  private eventWatcher() {
    const { root } = this.domConfig

    if (!root || !(root instanceof HTMLElement)) return

    this.domConfig.eventListeners.forEach((eventType) => {
      root.addEventListener(
        eventType,
        (e) => {
          const target = e.target as HTMLElement
          if (!target.hasAttribute(`${eventPrefix}`)) return

          const value = target.getAttribute(`${eventPrefix}`) || ''

          const data = {
            key: eventType,
            value
          }

          try {
            this.onReport(data)
          } catch {
            // Do nothing.
          }
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

            const data = {
              key: 'expose',
              value
            }
            
            try {
              this.onReport(data)
            } catch {
              // Do nothing.
            }
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

/**
 * 
 * @param domConfig A specific dom configuration.
 * @param onReport A dom visibility change and event report callback function.
 * @returns A domWatcher instance.
 */
export function createDomWatcher (domConfig: DomConfig, onReport: DomReportCallback) {
  return new DomWatcher(domConfig, onReport)
}