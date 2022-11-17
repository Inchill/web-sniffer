/**
 * @url api url
 * @domMonitor monitor dom visibility and events
 */
export interface Config {
  url: string
  domMonitor: boolean,
  jsError: boolean,
  resource: boolean
}

declare global {
  interface Window {
    $monitorConfig: Config
  }
}

export interface DOMConfig {
  visibility: boolean
  root: HTMLElement | null
  threshold: number
  event: boolean
  eventListeners: string[]
}
