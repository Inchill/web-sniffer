/**
 * @type A string to show sync or async error type.
 * @message A string containing a description of the error that occurred.
 * @filename A string containing the filename of the script file where the error occurred.
 * @lineno A number containing the line number where the error occurred.
 * @colno A number containing the column number where the error occurred.
 */
export interface SyncError {
  type: string,
  message: string,
  filename: string,
  lineno: number,
  colno: number
}

/**
 * @reason An unhandled rejection reason.
 */
export interface AsyncError {
  reason: string
}

type JsError = SyncError | AsyncError

/**
 * A js error report callback function.
 */
export interface JsErrorReportCallback {
  (detail: JsError): void
}