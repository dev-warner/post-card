import PromisePool from '@supercharge/promise-pool'

import { create } from './create.js'

import type { ICardModel } from './card.js'
import type { Template } from './template.js'

const DEFAULT_OPTIONS = Object.freeze<BatchOptions>({
  verbose: false,
  concurrency: 50,
})

export type BatchOptions = {
  concurrency: number
  verbose: boolean
}

/**
 * Perfect for SSG usage as at build time you can create Open graph images for each Post/Page
 *
 * ```typescript
 * import { PostCard } from '@post-cards/core'
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
