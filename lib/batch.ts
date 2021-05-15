import PromisePool from '@supercharge/promise-pool'

import { create } from './create.js'

import type { ICardModel } from './card.js'
import type { Template } from './template.js'

const DEFAULT_OPTIONS = Object.freeze<BatchOptions>({
  verbose: false,
  concurrency: 50,
})

export type BatchOptions = {
  /** maximum amount of items created at once */
  concurrency: number
  /** logging of information */
  verbose: boolean
}

/**
 * create many images using the specified template
 *
 * ```typescript
 * import generate from '@post-cards/core'
 *
 * await generate<{ title: string }>(Template, [
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
export async function batch<DataModel = Record<string, any>>(
  template: Template,
  items: Array<ICardModel<DataModel>> = [],
  options: Partial<BatchOptions> = {}
) {
  const config = Object.assign<{}, BatchOptions, Partial<BatchOptions>>(
    {},
    DEFAULT_OPTIONS,
    { ...options }
  )

  const { results } = await PromisePool.for(items)
    .withConcurrency(config.concurrency)
    .handleError((err) => {
      throw err
    })
    .process((item) => create<DataModel>(template, item, config))

  return results
}
