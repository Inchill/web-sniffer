/**
 * @type A string to show sync or async error type.
 * @message A string containing a description of the error that occurred.
 * @filename A string containing the filename of the script file where the error occurred.
 * @lineno A number containing the line number where the error occurred.
 * @colno A number containing the column number where the error occurred.
 */
interface SyncError {
    type: string;
    message: string;
    filename: string;
    lineno: number;
    colno: number;
}
/**
 * @reason An unhandled rejection reason.
 */
interface AsyncError {
    reason: string;
}
type JsError = SyncError | AsyncError;
/**
 * A js error report callback function.
 */
interface JsErrorReportCallback {
    (detail: JsError): void;
}

/**
 * @visibility A boolean determine to watch dom visibility.
 * @root A HTMLElement as the bounding box.
 * @threshold A list of number is used for trigger callback in IntersectionObserver.
 * @event A boolean determine to watch dom events.
 * @eventListeners A list of event types for listening.
 */
interface DomConfig {
    visibility: boolean;
    root: HTMLElement;
    threshold: number;
    event: boolean;
    eventListeners: string[];
}
/**
 * @key A key of data attribute or event type.
 * @value Detail info on dom.
 */
interface DomDetail {
    key: string;
    value: string;
}
/**
 * Dom report callback function declaration.
 */
interface DomReportCallback {
    (detail: DomDetail): void;
}

/**
 * @tagName The tag name of loading resource.
 * @url The resource origin url.
 */
interface ResourceDetail {
    tagName: string;
    url: string;
}
/**
 * A resource loading error report callback function.
 */
interface ResourceReportCallback {
    (detail: ResourceDetail): void;
}

/**
 * @oldURL The origin url.
 * @newURL The current url.
 */
interface RouteDetail {
    oldURL: string;
    newURL: string;
}
/**
 * A route change report callback function.
 */
interface RouteReportCallback {
    (detail: RouteDetail): void;
}

interface WebSniffer {
    version: string;
}
declare global {
    interface Window {
        WebSniffer: WebSniffer;
    }
}

export { AsyncError, DomConfig, DomDetail, DomReportCallback, JsErrorReportCallback, ResourceDetail, ResourceReportCallback, RouteDetail, RouteReportCallback, SyncError, WebSniffer };
