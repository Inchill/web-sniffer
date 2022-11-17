import { Config, DOMConfig } from './types/index'
import { createJsErrorMonitor } from './js/index'
import DomMonitor from './dom/index'
export default class WebMonitor {
  public config: Config

  constructor(config: Config) {
    this.config = Object.assign(this.normalizeConfig(), config)
    window.$monitorConfig = this.config

    const {
      url,
      jsError,
      resource
    } = this.config

    jsError && createJsErrorMonitor(url)
  }

  private normalizeConfig() {
    return <Config>{
      domMonitor: false,
      jsError: true,
      resource: true,
      url: ''
    }
  }

  /**
   * Create a DOM observer
   */
  public createDOMMonitor(domConfig: DOMConfig) {
    new DomMonitor(this.config.url, domConfig)
    return this
  }
}
