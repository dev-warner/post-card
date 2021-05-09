import path from 'path'
import puppeteer from 'puppeteer'
import PromisePool from '@supercharge/promise-pool'

import { Template } from '../template/template.js'
import { screenshot, ScreenshotOptions } from '../screenshot/index.js'
import { ConfigContainer } from '../config-container/config-container.js'

const DEFAULT_OPTIONS = Object.freeze({
  concurrency: 10,
})

/**
 * Item Model for creating cards
 *
 * @param output - [Requried]: needed for a location to save your image.
 * @param data - [Required]: the data needed for your template, check the template you're using for information needed here
 * @param options - [Optional]: Options for configuring caputre settings,
 * @param templateOveride - [Optional]: Can be used to swap out a template for an item
 */
export interface ICardModel<DataModel = Record<string, any>> {
  output: string
  options?: ScreenshotOptions
  templateOveride?: Template
  data: DataModel
}

export class PostCard {
  /**
   * Perfect for SSG usage as at build time you can create Open graph images for each Post/Page
   *
   * > **WARNING: When batching lots of items it will take alot of time, and on CI machines can use a fair amount of RAM use the `options.concurrency` to configure to your needs**
   *
   * ```typescript
   * import { PostCard } from '@dev-warner/post-card'
   *
   * await PostCard.batch<{ title: string }>(Template, [
   *    {
   *      output: 'media/home-page.png',
   *      data: {
   *        title: 'Home Page Fun'
   *     }
   *   },
   *   {
   *      output: 'media/about-page.png',
   *     data: {
   *        title: 'About me'
   *      }
   *   }
   *  ],
   *  {
   *    ... options
   *  }
   * )
   * ```
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
   * Good for single use creation of a `@dev-warner/post-card`
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
