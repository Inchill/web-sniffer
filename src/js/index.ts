import { JsErrorReportCallback } from '../types/index'

export function createJsErrorWatcher (onReport: JsErrorReportCallback) {
  if (typeof onReport !== 'function') return

  window.addEventListener('error', e => {
    const data = {
      type: e.type,
      message: e.message,
      filename: e.filename,
      lineno: e.lineno,
      colno: e.colno
    }
    
    try {
      onReport(data)
    } catch {
      // Do nothing.
    }
  })

  window.addEventListener('unhandledrejection', e => {
    const data = {
      reason: e.reason
    }
    
    try {
      onReport(data)
    } catch {
      // Do nothing.
    }
  })
}