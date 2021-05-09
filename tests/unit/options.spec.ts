import test from 'ava'
import fs from 'fs-extra'
import capture from 'capture-website'
import sinon, { SinonSandbox } from 'sinon'

import { PostCard } from '../../lib/post-card.js'
import { ScreenshotPrivate } from '../../lib/screenshot/index.js'

class Template {
  options = {
    styles: [`h1 { color: red}`],
  }

  render(item: any) {
    return `hello world`
  }
}

let sandbox: SinonSandbox

test.beforeEach(() => {
  sandbox = sinon.createSandbox()
})

test.afterEach.always(() => {
  sandbox.restore()
})

test('options should merge correctly', async (t) => {
  const buffer = sandbox
    .stub(capture, 'buffer')
    .returns(Promise.resolve(Buffer.from([])))
  const outputFile = sandbox
    .stub(fs, 'outputFile')
    .returns(await Promise.resolve())

  const ROOT_OPTIONS = {
    concurrency: 11,
    styles: [`* { box-sizing: border-box}`],
  }
  const RENDER_OPTIONS = {
    styles: [`h1 { red}`],
  }
  const ITEM_OPTIONS = {
    styles: [`h1 {blue}`],
  }

  const EXPECTED: ScreenshotPrivate & { concurrency: number } = {
    width: 1200,
    height: 630,

    concurrency: 11,

    inputType: 'html',

    _keepAlive: false,
    hideElements: [],
    modules: [],
    removeElements: [],
    scripts: [],
    styles: [`* { box-sizing: border-box}`, `h1 { red}`, `h1 {blue}`],
  }

  const template = new Template()

  template.options = RENDER_OPTIONS

  await PostCard.create(
    template,
    {
      output: '.tmp/test-image-2.jpg',
      data: {
        name: 'Joe Warner',
      },

      options: ITEM_OPTIONS,
    },
    ROOT_OPTIONS
  )

  const { _browser, ...actual } = buffer.args[0][1] as ScreenshotPrivate

  t.deepEqual(actual, EXPECTED)
})
