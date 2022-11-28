/**
 * @url report address
 * @jsError watch js errors
 * @resource watch resource loading
 * @route watch route changes
 */
export interface Config {
  url: string
  jsError: boolean,
  resource: boolean,
  route: boolean
}

declare global {
  interface Window {
    $snifferConfig: Config
  }
}

export interface DOMConfig {
  visibility: boolean
  root: HTMLElement | null
  threshold: number
  event: boolean
  eventListeners: string[]
}
