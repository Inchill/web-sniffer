import { ResourceReportCallback, ResourceDetail } from '../types/index'

let loadedResources: PerformanceResourceTiming[] = []
/** When performace API is not supported by browser */
let isFirstLoad = true
const loadedErrors: ErrorEvent[] = []
const loadedStyleSheets: StyleSheet[]  = []
const loadedScripts: HTMLScriptElement[] = []
const loadedImages: HTMLImageElement[] = []
/** */
let onReportFn: ResourceReportCallback

export function createResourceWatcher (onReport: ResourceReportCallback) {
  onReportFn = onReport
  onResourceLoadFailed()

  if (window.performance) {
    resourcePerfWatch()
  } else {
    listenOnload()
  }
}

function resourcePerfWatch () {
  const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
  // filter sendBeacon requests because it's used to post data only so we could ignore.
  loadedResources = entries.filter(entry => entry.initiatorType !== 'beacon')

  // clear resource information on page first load 
  performance.clearResourceTimings()


  // monitor subsequent resource loading information
  // this API cannot distinguish the status is success or not when resource is loaded, 
  // thus we've to manually filter the failed loadings by listening error.
  const perfObserver = new PerformanceObserver(list => {
    const _list = list.getEntries() as PerformanceResourceTiming[]
    loadedResources = _list.filter(entry => entry.initiatorType !== 'beacon')
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
      const data: ResourceDetail = {
        tagName: target.tagName.toLowerCase(),
        url
      }
      try {
        onReportFn(data)
      } catch {
        // Do nothing.
      }
    }
  })

  target instanceof HTMLScriptElement && loadedScripts.forEach(resource => {
    if (resource.src === url) {
      const data: ResourceDetail = {
        tagName: target.tagName.toLowerCase(),
        url
      }
      try {
        onReportFn(data)
      } catch {
        // Do nothing.
      }
    }
  })
  target instanceof HTMLImageElement && loadedImages.forEach(resource => {
    if (resource.src === url) {
      const data: ResourceDetail = {
        tagName: target.tagName.toLowerCase(),
        url
      }
      try {
        onReportFn(data)
      } catch {
        // Do nothing.
      }
    }
  })
}

function onResourceLoadFailed () {
  window.addEventListener('error', e => {
    // filter js error
    const target = e.target
    const isElementTarget = target instanceof HTMLScriptElement
      || target instanceof HTMLLinkElement
      || target instanceof HTMLImageElement
      || target instanceof HTMLVideoElement
      || target instanceof HTMLSourceElement
      || target instanceof HTMLAudioElement

    if (!isElementTarget) return false

    const url = (target as HTMLScriptElement
      || HTMLImageElement
      || HTMLVideoElement
      || HTMLSourceElement
      || HTMLAudioElement).src
      || (target as HTMLLinkElement).href
    
    if (window.performance) {
      loadedResources.forEach(resource => {
        if (resource.name === url) {
          const data: ResourceDetail = {
            tagName: resource.initiatorType,
            url
          }
          try {
            onReportFn(data)
          } catch {
            // Do nothing.
          }
        }
      })

      loadedResources = []
    } else {
      if (isFirstLoad) {
        loadedErrors.push(e)
      } else {
        const data: ResourceDetail = {
          tagName: (e.target as HTMLElement).tagName.toLowerCase(),
          url
        }
        try {
          onReportFn(data)
        } catch {
          // Do nothing.
        }
      }
    }
  }, {
    capture: true
  })
}