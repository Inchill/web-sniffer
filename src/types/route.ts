/**
 * @oldURL The origin url.
 * @newURL The current url.
 */
export interface RouteDetail {
  oldURL: string,
  newURL: string
}

/**
 * A route change report callback function.
 */
export interface RouteReportCallback {
  (detail: RouteDetail): void
}