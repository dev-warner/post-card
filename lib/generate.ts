import type { ICardModel } from './card.js'
import type { Template } from './template.js'

import { logger } from './logger.js'
import { batch, BatchOptions } from './batch.js'
import { create, CreateOptions } from './create.js'

/**
 * Perfect for SSG usage as at build time you can create Open graph images for each Post/Page
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
export function generate<DataModel = Record<string, any>>(
  template: Template,
  items: Array<ICardModel<DataModel>>,
  options?: Partial<BatchOptions>
): Promise<string[]>

/**
 *
 * Good for single use creation of a `@post-cards/core`
 *
 * ```typescript
 * import generate from '@post-cards/core'
 *
 * await generate<{ title: string }>(
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
export function generate<DataModel = Record<string, any>>(
  template: Template,
  items: ICardModel<DataModel>,
  options?: Partial<CreateOptions>
): Promise<string>

export async function generate<DataModel = Record<string, any>>(
  template: Template,
  items: ICardModel<DataModel> | Array<ICardModel<DataModel>>,
  options: CreateOptions | BatchOptions = {}
) {
  if (Array.isArray(items)) {
    options.verbose && logger.info(`Creating: ${items.length}`)

    return batch(template, items, options)
  }

  return create(template, items, options)
}
