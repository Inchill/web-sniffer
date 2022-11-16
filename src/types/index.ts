/**
 * @url api url
 * @domMonitor monitor dom visibility and events
 */
export interface Config {
  sendUrl: string
  domMonitor?: boolean
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
