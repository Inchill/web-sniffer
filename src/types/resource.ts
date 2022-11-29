/**
 * @tagName The tag name of loading resource.
 * @url The resource origin url.
 */
export interface ResourceDetail {
  tagName: string,
  url: string
}

/**
 * A resource loading error report callback function.
 */
export interface ResourceReportCallback {
  (detail: ResourceDetail): void
}