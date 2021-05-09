import { ScreenshotPrivate } from '../screenshot'

export class ConfigContainer {
  constructor(private options: ScreenshotPrivate) {}

  private get styles() {
    return this.options.styles || []
  }

  private get removeElements() {
    return this.options.removeElements || []
  }

  private get modules() {
    return this.options.modules || []
  }

  private get scripts() {
    return this.options.scripts || []
  }

  private get hideElements() {
    return this.options.hideElements || []
  }

  merge(options: ScreenshotPrivate = {}) {
    const {
      styles = [],
      hideElements = [],
      removeElements = [],
      modules = [],
      scripts = [],
      ...config
    } = options

    Object.assign(this.options, config, {
      styles: [...new Set([...this.styles, ...styles])],
      hideElements: [...new Set([...this.hideElements, ...hideElements])],
      removeElements: [...new Set([...this.removeElements, ...removeElements])],
      modules: [...new Set([...this.modules, ...modules])],
      scripts: [...new Set([...this.scripts, ...scripts])],
    })

    return this
  }

  get() {
    return this.options
  }
}
