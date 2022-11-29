import { RouteReportCallback } from '../types/index'

export function createRouteWatcher (onReport: RouteReportCallback) {
  window.onhashchange = function (hash: HashChangeEvent) {
    const {
      oldURL,
      newURL
    } = hash

    onReport({
      oldURL,
      newURL
    })
  }

  onEvents(['pushState', 'replaceState'], onReport)

  window.history.pushState = createHistoryEvent('pushState')
  window.history.replaceState = createHistoryEvent('replaceState')
}

function createHistoryEvent <T extends keyof History>(type: T) {
  const origin = history[type]
  return function (this: unknown) {
    // eslint-disable-next-line prefer-rest-params
    const res = origin.apply(this, arguments)
    const event = new Event(type)
    window.dispatchEvent(event)
    return res
  }
}

function onEvents (events: string[], onReport: RouteReportCallback) {
  events.forEach(event => {
    window.addEventListener(event, (evt: Event) => {
      const target = evt.target as Window
      const { href, origin } = target.location
      onReport({
        newURL: href,
        oldURL: origin
      })
    })
  })
}