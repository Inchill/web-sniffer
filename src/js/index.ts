import { reportEvent } from '../utils/index'

export function createJsErrorWatcher (url: string) {
  window.addEventListener('error', e => {
    const {
      message,
      type,
      lineno,
      colno,
      error
    } = e
    reportEvent(url, type, {
      message,
      lineno,
      colno,
      stack: error.stack
    })
  })

  window.addEventListener('unhandledrejection', e => {
    reportEvent(url, e.type, {
      reason: e.reason
    })
  })
}