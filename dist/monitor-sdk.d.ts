/**
 * @url api url
 * @domMonitor monitor dom visibility and events
 */
interface Config {
    url: string;
    domMonitor: boolean;
    jsError: boolean;
    resource: boolean;
}
declare global {
    interface Window {
        $monitorConfig: Config;
    }
}
interface DOMConfig {
    visibility: boolean;
    root: HTMLElement | null;
    threshold: number;
    event: boolean;
    eventListeners: string[];
}

export { Config, DOMConfig };
