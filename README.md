# web-monitor

A web monitor tool can report data automatically to db before you've provided API url. It has below functionalities:

- **DOM Monitor**: Monitor DOM events and visibility.
- **JavaScript errors Monitor**: Monitor javascript runtime errors including sync and async code.
- **Resource Monitor**: Monitor resource loading errors including html, js, css and images etc.
- **Performance Monitor**: Monitor page performance including FP, FCP, LCP, DCL etc.
- **Network Monitor**: Monitor network.
- **URL Monitor**: Monitor url changes.
- **Memory Monitor**: Monitor memory leak.
- **Custom behaviour Monitor**: Provide custom methods to monitor specific behaviour like PV, UV etc.

## Install

## API

### createDOMMonitor

How to use?

```js
let wm = new WebMonitor({
  url: '' // An address to report data
})

const config = {
  root: document.documentElement
}

wm.createDOMMonitor(config)
```

| name | type | description |
| ---- | ----- | ------ |
| visibility | boolean | Dom visibility detection |
| root | HTMLElement | Ehe Element or Document whose bounds are used as the bounding box when testing for intersection. |
| threshold | number | A list of thresholds, sorted in increasing numeric order, where each threshold is a ratio of intersection area to bounding box area of an observed target. Notifications for a target are generated when any of the thresholds are crossed for that target. If no value was passed to the constructor, 0 is used. |
| event | boolean | Dom event detection |
|  eventListeners | array | Dom events like click, dbclick, mouseenter etc. |


### JsError

The web monitor will default capture the js errors including sync errors and async errors like promise unhandledrejection.
If you do not wanna monitor js errors, just set the `jsError` as false in the config. 

### Resource

In the Config the `resource` is set to true by default, and the web monitor will track the img, script and link resources
loading, if loaded failed it will report the info which has target tag name and url.

> **Tip**: When the page is first to load resources, the web monitor maybe loaded behind the link css stylesheets, in such case
the web monitor could not track the failed loadings.

## Usage
