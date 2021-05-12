import path from 'path'

import { save } from './save.js'

import type { Template } from './template.js'
import type { ICardModel } from './card.js'
import { logger } from './logger.js'

export type CreateOptions = {
  verbose?: boolean
}

const DEFAULT_OPTIONS = Object.freeze<CreateOptions>({
  verbose: false,
})

/**
 *
 * Good for single use creation of a `@post-cards/core`
 *
 * ```typescript
 * await create<{ title: string }>(
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
