# web-sniffer

- [Overview](#overview)
- [Install and load the library](#install-and-load-the-library)
  - [From npm](#from-npm)
  - [From a CDN](#from-a-cdn)
- [Usage](#usage)
  - [createDomWatcher](#createdomwatcher)
    - [In Vue](#in-vue)
    - [In React]()
  - [jsError](#jserror)
  - [resource loading](#resource-loading)
  - [Performance](#performance)

## Overview

The `web-sniffer` library is a tool which can track dom events & visibility, javascript runtime errors, resource loading, 
page performance, network, route changes, memory leaks and custom behavior etc.

## Install and load the library
### From npm

```shell
npm i web-sniffer
```

### From a CDN

```html
<script src="https://unpkg.com/web-sniffer@1.0.2/dist/web-sniffer.min.js"></script>
```

Or

```html
<script type="module">
  import WebSniffer from 'https://unpkg.com/web-sniffer@1.0.2/dist/web-sniffer.esm.js'
</script>
```
## Usage

### createDomWatcher

```js
let ws = new WebSniffer({
  url: '' // An address to report data
})

const domConfig = {
  root: document.documentElement
}

ws.createDomWatcher(domConfig)
```

The `domConfig` has the following configuration items:

| name | type | default | description |
| ---- | ----- | ------ | ----------- |
| visibility | boolean | true | Dom visibility detection |
| root | HTMLElement | document.documentElement | Ehe Element or Document whose bounds are used as the bounding box when testing for intersection. |
| threshold | number | 0.2 | A list of thresholds, sorted in increasing numeric order, where each threshold is a ratio of intersection area to bounding box area of an observed target. Notifications for a target are generated when any of the thresholds are crossed for that target. If no value was passed to the constructor, 0 is used. |
| event | boolean | true | Dom event detection |
| eventListeners | array | ['click'] | Dom events like click, dbclick, mouseenter etc. |

#### In Vue

```js
// App.vue
import HelloWorld from './components/HelloWorld.vue'
import WebSniffer from 'web-sniffer/dist/web-sniffer.esm'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  mounted () {
    let ws = new WebSniffer({
      url: '//localhost:8081'
    })
    ws.createDomWatcher({
      root: document.documentElement,
      event: true,
      eventListeners: ['click']
    })

    let img = document.createElement('img')
    img.src = '//localhost:8081/101.png'
    document.body.appendChild(img)
  }
}
```

```html
<!-- HelloWorld.vue -->
<h3 :data-event-click="msg" :data-expose="msg">Ecosystem</h3>
```

Before using custom data attributes, you have to register event type in `eventListeners`. Using data attributes can avoid the third javascript frameworks filtering custom directives.

> **Notice**: The prefix `data-event-` should always concat event `type` so it could work correctly.

#### In React

```jsx
// App.js
import Hello from './components/hello'
function App () {
  useEffect(() => {
    let ws = new webSnifferEsm({
      url: '//localhost:3000'
    })
    
    ws.createDomWatcher({
      root: document.documentElement
    })
  }, [])

  return (
    <div className="App" data-expose="App show">
      <Hello/>
    </div>
  )
}
```

```jsx
// Hello.js
export default function Hello () {
  return (
    <h1 data-expose="hello world" data-event-click="clicked me">hello world</h1>
  )
}
```

### JsError

```js
let ws = new WebSniffer({
  url: '', // An address to report data
  jsError: true
})
```

By default, the `web-sniffer` will catch js errors, including synchronous errors and asynchronous errors such as promise unhandledrejection.
If you don't want to catch js errors, just set `jsError` to false in the configuration.

### Resource loading

```js
let ws = new WebSniffer({
  url: '', // An address to report data
  resource: true
})
```

In the config the `resource` is set to true by default, and the `web-sniffer` will track the img, script and link resources
loading, if loaded failed it will report the detail info which has target tag name and url.

> **Notice**: When the page is first to load resources, the `web-sniffer` maybe loaded behind the css stylesheets link, in such case it could not track the failed link loadings.

If performance API is not supported in the browser, a work around way is combining onerror and onreadystatechange handlers.
When the page is first to load, onerror handler may be called before onreadystatechange handler and onreadystatechange handler  works only once, so there is a flag to check if the loading errors are first loading.

> **Notice**: Using background-image to load would not be detected.

### Route

```js
let ws = new WebSniffer({
  url: '', // An address to report data
  route: true
})
```

This will track route changes by default, and report the old url and new url.

### Performance
