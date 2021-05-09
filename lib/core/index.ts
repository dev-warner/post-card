import path from 'path'
import puppeteer from 'puppeteer'
import PromisePool from '@supercharge/promise-pool'

import { Template } from '../template/template.js'
import { screenshot, ScreenshotOptions } from '../screenshot/index.js'
import { ConfigContainer } from '../config-container/config-container.js'

const DEFAULT_OPTIONS = Object.freeze({
  concurrency: 20,
})

/**
 *
 */
export interface ICardModel<DataModel = Record<string, any>> {
  output: string
  options?: ScreenshotOptions
  templateOveride?: Template
  data: DataModel
}

export class PostCard {
  /**
   *
   * @param template
   * @param items
   * @param options
   */
  static async batch<DataModel = Record<string, any>>(
    template: Template,
    items: Array<ICardModel<DataModel>> = [],
    options: ScreenshotOptions = {}
  ) {
    const config = Object.assign(
      {},
      DEFAULT_OPTIONS,
      JSON.parse(JSON.stringify(options))
    )

    const browser = await puppeteer.launch({ headless: true })

    try {
      await PromisePool.for(items)
        .withConcurrency(config.concurrency)
        .handleError((error) => {
          throw error
        })
        .process((item) =>
          PostCard.create<DataModel>(template, item, config, browser)
        )
    } finally {
      await browser.close()
    }
  }

  /**
   *
   * Good for single use creation of a `post-card`
   *
   * > **WARNING: Would suggest against using this method if you're creating a lot of cards as it spins up a headless browser and closes for each call**
   *
   * ```typescript
   * await PostCard.create<{ title: string }>(
   *  Template,
   *  {
   *   output: 'media/home-page.png',
   *   data: {
   *     title: 'My great HomePage',
   *   },
   *  },
   *  {
   *    ...options,
   *  }
   * )
   * ```
   */
  static async create<DataModel = Record<string, any>>(
    template: Template,
    item: ICardModel<DataModel>,
    options: ScreenshotOptions = {},
    browser?: puppeteer.Browser
  ) {
    const renderer = item.templateOveride || template
    const html = await renderer.render(item)

    let keepAlive = true

    if (!browser) {
      keepAlive = false
    }

    const screenshotConfig = {
      _browser: browser,
      _keepAlive: keepAlive,
    }

    const config = new ConfigContainer(options)
      .merge(renderer.options)
      .merge(item.options)
      .merge(screenshotConfig)
      .get()

    const toScreenshot = {
      html,
      output: path.join(process.cwd(), item.output),
      options: config,
    }
    const _path = await screenshot(toScreenshot)

    return _path
  }
}
