import type { ICardModel } from './card.js'

/**
 * @abstract
 *
 * This is the Class interface for creating custom templates.
 *
 * @requires method  template.render - which should return a Promise<Buffer> | Buffer
 */
export abstract class Template {
  /**
   * render is the function where your template gets hydrated with item data
   *
   * @param data: Item Model for creating your template
   */
  abstract render<DataModel = Record<string, any>>(
    data: ICardModel<DataModel>
  ): Promise<Buffer> | Buffer
}
