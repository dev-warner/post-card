import { ICardModel } from '../core'
import { ScreenshotOptions } from '../screenshot'

/**
 * @abstract
 *
 * This is the Class interface for creating custom template.
 *
 * @requires method  template.render - which should return a Promise<string> | string
 */
export abstract class Template {
  options?: ScreenshotOptions = {}

  /**
   * render is the function where your template gets hydrated with item data
   *
   * @param data: Item Model for creating your template
   */
  abstract render<T = Record<string, any>>(
    data: ICardModel<T>
  ): Promise<string> | string
}
