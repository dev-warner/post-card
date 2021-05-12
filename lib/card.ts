import type { Template } from './template.js'

export interface CardOptions {}

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
  options?: CardOptions
  templateOveride?: Template
  data: DataModel
}
