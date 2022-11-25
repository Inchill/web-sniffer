import { reportEvent } from '../utils/index'

export function createRouteMonitor (url: string) {
  window.onhashchange = function (hash: HashChangeEvent) {
    const {
      type,
      oldURL,
      newURL
    } = hash

    reportEvent(url, type, {
      oldURL,
      newURL
    })
  }

  onEvents(['pushState', 'replaceState'], url)

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

function onEvents (events: string[], url: string) {
  events.forEach(event => {
    window.addEventListener(event, (evt: Event) => {
      const target = evt.target as Window
      const { href, origin } = target.location
      reportEvent(url, evt.type, {
        href,
        origin
      })
    })
  })
}