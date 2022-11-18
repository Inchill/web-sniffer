# web-monitor

A web monitor tool. It has below functionalities:

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

### Resource

In the Config the `resource` is set to true by default, and the web monitor will track the img, script and link resources
loading, if loaded failed it will report the info which has target tag name and url.

> **Tip**: When the page is first to load resources, the web monitor maybe loaded behind the link css stylesheets, in such case
the web monitor could not track the failed loadings.

## Usage
