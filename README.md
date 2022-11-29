# web-sniffer

- [Overview](#overview)
- [Install and load the library](#install-and-load-the-library)
  - [From npm](#from-npm)
  - [From a CDN](#from-a-cdn)
- [Usage](#usage)
  - [createDomWatcher](#createdomwatcher)
    - [In Vue](#in-vue)
    - [In React]()
  - [createJsErrorWatcher](#createjserrorwatcher)
  - [createResourceWatcher](#createresourcewatcher)
  - [createRouteWatcher](#createroutewatcher)

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
<script src="https://unpkg.com/web-sniffer@1.0.4/dist/web-sniffer.min.js"></script>
```

Or

```html
<script type="module">
  import { createDomWatcher } from 'https://unpkg.com/web-sniffer@1.0.4/dist/web-sniffer.esm.js'
  createDomWatcher({
    visibility: true
  }, console.log)
</script>
```
## Usage

### createDomWatcher

```js
const reportCallback = (data) => {
  const body = JSON.stringify(data);
  const url = 'http://127.0.0.1:8080/analytics';

  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body);
  } else {
    fetch(url, { body, method: 'POST', keepalive: true });
  }
}

const domConfig = {
  visibility: true,
  event: true
}

createDomWatcher(domConfig, reportCallback)
```

The `domConfig` has the following configuration items:

| name | type | default | description |
| ---- | ----- | ------ | ----------- |
| visibility | boolean | false | Dom visibility detection |
| root | HTMLElement | document.documentElement | The Element or Document whose bounds are used as the bounding box when testing for intersection. |
| threshold | number | 0.2 | A list of thresholds, sorted in increasing numeric order, where each threshold is a ratio of intersection area to bounding box area of an observed target. Notifications for a target are generated when any of the thresholds are crossed for that target. If no value was passed to the constructor, 0 is used. |
| event | boolean | false | Dom event detection |
| eventListeners | array | ['click'] | Dom events like click, dbclick, mouseenter etc. |

#### In Vue

```js
// App.vue
import HelloWorld from './components/HelloWorld.vue'
import { createDomWatcher, createResourceWatcher } from 'web-sniffer/dist/web-sniffer.esm'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  mounted () {
    createDomWatcher({
      visibility: true,
      event: true
    }, this.reportCallback)

    createResourceWatcher(this.reportCallback)

    let img = document.createElement('img')
    img.src = '//localhost:8081/101.png'
    document.body.appendChild(img)
  },
  methods: {
    reportCallback: (data) => {
      const body = JSON.stringify(data);
      const url = 'http://127.0.0.1:8080/analytics';

      // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
      if (navigator.sendBeacon) {
        navigator.sendBeacon(url, body);
      } else {
        fetch(url, { body, method: 'POST', keepalive: true });
      }
    }
  }
}
```

```html
<!-- HelloWorld.vue -->
<h3 :data-event="msg" :data-expose="msg">Ecosystem</h3>
```

Before using custom data attributes, you have to register event type in `eventListeners`. Using data attributes can avoid the third-party javascript frameworks filtering custom directives.

#### In React

```jsx
// App.js
import { createDomWatcher } from 'web-sniffer/dist/web-sniffer.esm';
import Hello from './components/hello'

function App() {
  const reportCallback = (data) => {
    const body = JSON.stringify(data);
    const url = 'http://127.0.0.1:8080/analytics';

    // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, body);
    } else {
      fetch(url, { body, method: 'POST', keepalive: true });
    }
  }

  useEffect(() => {
    createDomWatcher({
      visibility: true,
      event: true
    }, reportCallback)
  }, [])

  return (
    <div className="App" data-expose="App show">
      <Hello/>
    </div>
  );
}

export default App;
```

```jsx
// Hello.js
export default function Hello () {
  return (
    <h1 data-expose="hello world" data-event="clicked me">hello world</h1>
  )
}
```

### createJsErrorWatcher

```js
import { createJsErrorWatcher } from 'web-sniffer/dist/web-sniffer.esm'

createJsErrorWatcher(console.log)
```

The `web-sniffer` will catch js errors, including synchronous errors and asynchronous errors such as promise unhandledrejection.
You can pass on a callback function to handle captured errors.

### createResourceWatcher

```js
import { createResourceWatcher } from 'web-sniffer/dist/web-sniffer.esm'

createResourceWatcher(console.log)
```

The `web-sniffer` will track the img, script and link resources loading, if loaded failed it will report the target info which has tag name and url.

> **Notice**: When the page is first to load resources, the `web-sniffer` maybe loaded behind the css stylesheets link, in such case it could not track the failed link loadings.

If performance API is not supported in the browser, a work around way is combining onerror and onreadystatechange handlers.
When the page is first to load, onerror handler may be called before onreadystatechange handler and onreadystatechange handler  works only once, so there is a flag to check if the loading errors are first loading.

> **Notice**: Using background-image to load would not be detected.

### createRouteWatcher

```js
import { createRouteWatcher } from 'web-sniffer/dist/web-sniffer.esm'

createRouteWatcher(console.log)
```

It will detect hash and history changes, you can pass on a callback function to handle the detail info which contains oldURL and newURL.

### Performance

### Network

### Memory

### Behavior
