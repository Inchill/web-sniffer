import { reportEvent } from '../utils/index'

let loadedResources: PerformanceResourceTiming[] = []
let reportUrl: string = ''

export function createResourceMonitor (url: string) {
  reportUrl = url
  listenOnResourceLoadFailed()

  if (window.performance) {
    resourcePerfWatch()
  } else {
    listenOnload()
  }
}

function resourcePerfWatch () {
  let entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
  // filter sendBeacon requests because it's used to post data only so we could ignore.
  loadedResources = entries.filter(entry => entry.initiatorType !== 'beacon')

  // loadedResources.forEach(entry => {
  //   console.log('first resource loads entry', entry)
  // })

  // clear resource information on page first load 
  performance.clearResourceTimings()


  // monitor subsequent resource loading information
  // this API cannot distinguish the status is success or not when resource is loaded, 
  // thus we've to manually filter the failed loadings by listening error.
  const perfObserver = new PerformanceObserver(list => {
    let _list = list.getEntries() as PerformanceResourceTiming[]
    loadedResources = _list.filter(entry => entry.initiatorType !== 'beacon')

    // loadedResources.forEach(entry => {
    //   console.log('daynamic loaded resource', entry)
    // })
  })

  perfObserver.observe({
    entryTypes: ['resource']
  })
}

function listenOnload () {
  window.addEventListener('load', e => {
    console.log(e)
  })
}

function listenOnResourceLoadFailed () {
  window.addEventListener('error', e => {
    // filter js error
    let target = e.target
    let isElementTarget = target instanceof HTMLScriptElement
      || target instanceof HTMLLinkElement
      || target instanceof HTMLImageElement

    if (!isElementTarget) return false

    const url = (target as HTMLScriptElement || HTMLImageElement).src || (target as HTMLLinkElement).href

    loadedResources.forEach(resource => {
      if (resource.name === url) {
        reportEvent(reportUrl, e.type, {
          target: resource.initiatorType,
          url
        })
      }
    })

    loadedResources = []
  }, {
    capture: true
  })
}