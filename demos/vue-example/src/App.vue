<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld data-expose="hello world expose" msg="Welcome to Your Vue.js App"/>
</template>

<script>
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
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
