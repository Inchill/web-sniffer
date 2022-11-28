import { Config, DOMConfig } from './types/index'
import { createJsErrorWatcher } from './js/index'
import DomWatcher from './dom/index'
import { createResourceWatcher } from './resource/index'
import { createRouteWatcher } from './route/index'
export default class WebSniffer {
  public config: Config

  constructor(config: Config) {
    this.config = Object.assign(this.normalizeConfig(), config)
    window.$snifferConfig = this.config

    const {
      url,
      jsError,
      resource,
      route
    } = this.config

    jsError && createJsErrorWatcher(url)
    resource && createResourceWatcher(url)
    route && createRouteWatcher(url)
  }

  private normalizeConfig() {
    return <Config>{
      url: '',
      jsError: true,
      resource: true,
      route: true
    }
  }

  /**
   * Create a DOM observer
   */
  public createDomWatcher(domConfig: DOMConfig) {
    new DomWatcher(this.config.url, domConfig)
    return this
  }
}
