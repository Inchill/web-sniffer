<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld data-expose="hello world expose" msg="Welcome to Your Vue.js App"/>
</template>

<script>
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
      root: document.documentElement
    })

    let img = document.createElement('img')
    img.src = '//localhost:8081/101.png'
    document.body.appendChild(img)
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
