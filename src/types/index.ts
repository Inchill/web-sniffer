export interface WebSniffer {
  version: string
}
declare global {
  interface Window {
    WebSniffer: WebSniffer
  }
}

export * from './js'
export * from './dom'
export * from './resource'
export * from './route'
