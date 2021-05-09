import { ICardModel } from '../core'
import { ScreenshotOptions } from '../screenshot'

export abstract class Template {
  options?: ScreenshotOptions = {}

  abstract render<T = Record<string, any>>(
    data: ICardModel<T>
  ): Promise<string> | string
}
