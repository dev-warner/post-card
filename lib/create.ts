import path from 'path'

import { save } from './save.js'
import { logger } from './logger.js'

import type { Template } from './template.js'
import type { ICardModel } from './card.js'

export type CreateOptions = {
  /** logging of information */
  verbose?: boolean
}

const DEFAULT_OPTIONS = Object.freeze<CreateOptions>({
  verbose: false,
})

/**
 *
 * create a image using the specified template.
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
export async function create<DataModel = Record<string, any>>(
  template: Template,
  item: ICardModel<DataModel>,
  options: CreateOptions = {}
) {
  const config = Object.assign<{}, CreateOptions, Partial<CreateOptions>>(
    {},
    DEFAULT_OPTIONS,
    { ...options }
  )
  const output = path.join(process.cwd(), item.output)

  try {
    const renderer = item.templateOveride || template
    const buffer = await renderer.render(item)
    const _path = await save(output, buffer)

    if (config.verbose) {
      logger.success(`Created: ${_path}`)
    }

    return _path
  } catch (err) {
    if (config.verbose) {
      logger.error(`Failed to create: ${output}`)
    }

    throw err
  }
}
