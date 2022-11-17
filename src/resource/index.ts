import { reportEvent } from '../utils/index'

export function createResourceMonitor () {
  if (window.performance) {
    performanceWatch()
  } else {
    listenOnload()
  }
}

function performanceWatch () {
  const perfObserver = new PerformanceObserver(list => {
    // console.log(111, list.getEntries())
  })

  perfObserver.observe({
    entryTypes: ['resource']
  })

  let entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
  // filter sendBeacon requests
  entries = entries.filter(entry => entry.initiatorType !== 'beacon')

  for (const entry of entries) {
    console.log('entry', entry)
  }

  performance.clearResourceTimings()
  setTimeout(performanceWatch, 2000)
}

function listenOnload () {
  window.onload = (e) => {
    console.log(e)
  }
}