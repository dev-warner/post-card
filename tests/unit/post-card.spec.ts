import path from 'path'
import fs from 'fs-extra'
import test from 'ava'
import capture from 'capture-website'
import { PostCard } from '../../lib/post-card.js'

import sinon, { SinonSandbox } from 'sinon'

class MockTemplate {
  options = {
    styles: [
      `
        h1 {
            color: red;
        }
      `,
    ],
  }
  render(item: any) {
    return `<h1>hello ${item.data.name}</h1>`
  }
}

let sandbox: SinonSandbox

test.beforeEach(() => {
  sandbox = sinon.createSandbox()
})

test.afterEach.always(() => {
  sandbox.restore()
})

test('should create images', async (t) => {
  const outputFile = sandbox
    .stub(fs, 'outputFile')
    .returns(await Promise.resolve())

  const buffer = sandbox
    .stub(capture, 'buffer')
    .returns(Promise.resolve(Buffer.from([])))

  await PostCard.batch(new MockTemplate(), [
    {
      output: '.tmp/test-image-1.jpg',
      data: {
        name: 'Joe Warner 1',
      },
    },
    {
      output: '.tmp/test-image-3.jpg',
      data: {
        name: 'Joe Warner 2',
      },
    },
  ])

  const firstFileCall = buffer.getCall(0).args
  // @ts-ignore-next-line
  const { _browser, ...firstConfig } = firstFileCall[1]

  t.deepEqual(firstFileCall[0], `<h1>hello Joe Warner 1</h1>`)
  t.deepEqual(firstConfig as any, {
    _keepAlive: true,
    concurrency: 10,
    height: 630,
    inputType: 'html',
    styles: [
      `
        h1 {
            color: red;
        }
      `,
    ],
    hideElements: [],
    modules: [],
    removeElements: [],
    scripts: [],
    width: 1200,
  })

  const secondFileCall = buffer.getCall(1).args
  // @ts-ignore-next-line
  const { _browser: browser2, ...secondConfig } = secondFileCall[1]
  t.deepEqual(secondFileCall[0], `<h1>hello Joe Warner 2</h1>`)
  t.deepEqual(secondConfig as any, {
    _keepAlive: true,
    concurrency: 10,
    height: 630,
    inputType: 'html',
    styles: [
      `
        h1 {
            color: red;
        }
      `,
    ],
    hideElements: [],
    modules: [],
    removeElements: [],
    scripts: [],
    width: 1200,
  })

  // @ts-ignore-next-line
  t.deepEqual(outputFile.getCall(0).args, [
    path.join(process.cwd(), '.tmp/test-image-1.jpg'),
    Buffer.from([]),
    {
      encoding: 'utf-8',
    },
  ])

  // @ts-ignore-next-line
  t.deepEqual(outputFile.getCall(1).args, [
    path.join(process.cwd(), '.tmp/test-image-3.jpg'),
    Buffer.from([]),
    {
      encoding: 'utf-8',
    },
  ])
})

test('should create image', async (t) => {
  const outputFile = sandbox
    .stub(fs, 'outputFile')
    .returns(await Promise.resolve())

  const buffer = sandbox
    .stub(capture, 'buffer')
    .returns(Promise.resolve(Buffer.from([])))

  await PostCard.create(new MockTemplate(), {
    output: '.tmp/test-image-2.jpg',
    data: {
      name: 'Joe Warner',
    },
  })

  // @ts-ignore-next-line
  t.deepEqual(outputFile.getCall(0).args, [
    path.join(process.cwd(), '.tmp/test-image-2.jpg'),
    Buffer.from([]),
    {
      encoding: 'utf-8',
    },
  ])

  const firstFileCall = buffer.getCall(0).args
  // @ts-ignore-next-line
  const { _browser, ...firstConfig } = firstFileCall[1]

  t.deepEqual(firstFileCall[0], `<h1>hello Joe Warner</h1>`)
  t.deepEqual(firstConfig as any, {
    _keepAlive: false,
    height: 630,
    inputType: 'html',
    styles: [
      `
        h1 {
            color: red;
        }
      `,
    ],
    hideElements: [],
    modules: [],
    removeElements: [],
    scripts: [],
    width: 1200,
  })
})

test('Should return error if failed', async (t) => {
  sandbox
    .stub(fs, 'outputFile')
    .returns(await Promise.resolve())
    .throws(() => new Error('Somethings gone wrong.'))

  sandbox.stub(capture, 'buffer').returns(Promise.resolve(Buffer.from([])))

  const error = await t.throwsAsync(
    () =>
      PostCard.batch(new MockTemplate(), [
        {
          output: '.tmp/test-image-1.jpg',
          data: {
            name: 'Joe Warner 1',
          },
        },
        {
          output: '.tmp/test-image-3.jpg',
          data: {
            name: 'Joe Warner 2',
          },
        },
      ]),
    { message: 'Somethings gone wrong.' }
  )

  t.is(error.message, 'Somethings gone wrong.')
})

test('should set capture to remote if render returns url', async (t) => {
  sandbox.stub(fs, 'outputFile').returns(await Promise.resolve())
  const buffer = sandbox
    .stub(capture, 'buffer')
    .returns(Promise.resolve(Buffer.from([])))

  await PostCard.create(
    { render: () => 'https://google.com' },
    {
      output: '.tmp/test-image-1.jpg',
      data: {
        name: 'Joe Warner 1',
      },
    }
  )

  t.deepEqual((buffer.getCall(0).args[1] as any).inputType as string, 'url')
})
