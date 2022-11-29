/**
 * @visibility A boolean determine to watch dom visibility.
 * @root A HTMLElement as the bounding box.
 * @threshold A list of number is used for trigger callback in IntersectionObserver.
 * @event A boolean determine to watch dom events.
 * @eventListeners A list of event types for listening.
 */
export interface DomConfig {
  visibility: boolean
  root: HTMLElement
  threshold: number
  event: boolean
  eventListeners: string[]
}

/**
 * @key A key of data attribute or event type.
 * @value Detail info on dom.
 */
export interface DomDetail {
  key: string,
  value: string
}

/**
 * Dom report callback function declaration.
 */
export interface DomReportCallback {
  (detail: DomDetail): void
}