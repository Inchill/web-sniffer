import { reportEvent } from '../utils/index'

let loadedResources: PerformanceResourceTiming[] = []
/** When performace API is not supported by browser */
let isFirstLoad: boolean = true
let loadedErrors: ErrorEvent[] = []
let loadedStyleSheets: StyleSheet[]  = []
let loadedScripts: HTMLScriptElement[] = []
let loadedImages: HTMLImageElement[] = []
/** */
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
  document.onreadystatechange = (e) => {
    if (document.readyState === 'complete') {
      const target = e.target as Document
      const {
        styleSheets,
        scripts,
        images
      } = target

      for (const item of styleSheets) {
        if (item.href) {
          loadedStyleSheets.push(item)
        }
      }

      for (const item of scripts) {
        if (item.src) {
          loadedScripts.push(item)
        }
      }

      for (const item of images) {
        if (item.src) {
          loadedImages.push(item)
        }
      }

      // first load
      loadedErrors.forEach(e => {
        const target = e.target
        const url = (target as HTMLScriptElement || HTMLImageElement).src || (target as HTMLLinkElement).href
        filterFailedResources(e.target, e.type, url)
      })

      isFirstLoad = false
    }
  }
}

function filterFailedResources (target: EventTarget | null, type: string, url: string) {
  target instanceof HTMLLinkElement && loadedStyleSheets.forEach(resource => {
    if (resource.href === url) {
      reportEvent(reportUrl, type, {
        target: target.tagName.toLowerCase(),
        url
      })
    }
  })

  target instanceof HTMLScriptElement && loadedScripts.forEach(resource => {
    if (resource.src === url) {
      reportEvent(reportUrl, type, {
        target: target.tagName.toLowerCase(),
        url
      })
    }
  })
  target instanceof HTMLImageElement && loadedImages.forEach(resource => {
    if (resource.src === url) {
      reportEvent(reportUrl, type, {
        target: target.tagName.toLowerCase(),
        url
      })
    }
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
    
    if (window.performance) {
      loadedResources.forEach(resource => {
        if (resource.name === url) {
          reportEvent(reportUrl, e.type, {
            target: resource.initiatorType,
            url
          })
        }
      })

      loadedResources = []
    } else {
      if (isFirstLoad) {
        loadedErrors.push(e)
      } else {
        reportEvent(reportUrl, e.type, {
          target: (e.target as HTMLElement).tagName.toLowerCase(),
          url
        })
      }
    }
  }, {
    capture: true
  })
}