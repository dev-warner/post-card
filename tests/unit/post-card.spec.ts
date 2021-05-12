import path from 'path'
import test from 'ava'
import fs from 'fs-extra'

import sinon, { SinonSandbox } from 'sinon'

import generate from '../../lib/post-card.js'
import { logger } from '../../lib/logger.js'

class MockTemplate {
  render(item: any) {
    return Buffer.from([])
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

  await generate(new MockTemplate(), [
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

  sinon.assert.calledTwice(outputFile)

  const {
    args: [_path, buffer, options],
  } = outputFile.getCall(0) as any

  t.is(_path, path.join(process.cwd(), '.tmp/test-image-1.jpg'))
  t.deepEqual(buffer, Buffer.from([]))
  t.deepEqual(options, { encoding: 'utf-8' })

  const args2 = outputFile.getCall(1) as any
  const {
    args: [path2, buffer2, options2],
  } = outputFile.getCall(1) as any

  t.is(path2, path.join(process.cwd(), '.tmp/test-image-3.jpg'))
  t.deepEqual(buffer2, Buffer.from([]))
  t.deepEqual(options2, { encoding: 'utf-8' })
})

test('should create image', async (t) => {
  const outputFile = sandbox
    .stub(fs, 'outputFile')
    .returns(await Promise.resolve())

  await generate(new MockTemplate(), {
    output: '.tmp/test-image-2.jpg',
    data: {
      name: 'Joe Warner',
    },
  })

  sinon.assert.calledOnce(outputFile)

  const {
    args: [_path, buffer, options],
  } = outputFile.getCall(0) as any

  t.is(_path, path.join(process.cwd(), '.tmp/test-image-2.jpg'))
  t.deepEqual(buffer, Buffer.from([]))
  t.deepEqual(options, { encoding: 'utf-8' })
})

test('should log success if verbose true', async (t) => {
  const sucess = sandbox.stub(logger, 'success')
  const outputFile = sandbox
    .stub(fs, 'outputFile')
    .returns(await Promise.resolve())

  await generate(
    new MockTemplate(),
    {
      output: '.tmp/test-image-2.jpg',
      data: {
        name: 'Joe Warner',
      },
    },
    { verbose: true }
  )

  sinon.assert.calledOnce(outputFile)

  const {
    args: [_path, buffer, options],
  } = outputFile.getCall(0) as any

  t.is(_path, path.join(process.cwd(), '.tmp/test-image-2.jpg'))
  t.deepEqual(buffer, Buffer.from([]))
  t.deepEqual(options, { encoding: 'utf-8' })

  sinon.assert.calledWith(
    sucess,
    `Created: ${path.join(process.cwd(), '.tmp/test-image-2.jpg')}`
  )
})

test('Should return error if failed', async (t) => {
  sandbox
    .stub(fs, 'outputFile')
    .returns(await Promise.resolve())
    .throws(() => new Error('Somethings gone wrong.'))

  const error = await t.throwsAsync(
    () =>
      generate(new MockTemplate(), [
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

test('Should log error if verbose true', async (t) => {
  sandbox
    .stub(fs, 'outputFile')
    .returns(await Promise.resolve())
    .throws(() => new Error('Somethings gone wrong.'))

  const errorLog = sandbox.stub(logger, 'error')
  const info = sandbox.stub(logger, 'info')

  const error = await t.throwsAsync(
    () =>
      generate(
        new MockTemplate(),
        [
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
        ],
        { verbose: true }
      ),
    { message: 'Somethings gone wrong.' }
  )

  sinon.assert.calledWith(info, 'Creating: 2')

  t.is(error.message, 'Somethings gone wrong.')

  sinon.assert.calledWith(
    errorLog,
    `Failed to create: ${path.join(process.cwd(), '.tmp/test-image-1.jpg')}`
  )
  sinon.assert.calledWith(
    errorLog,
    `Failed to create: ${path.join(process.cwd(), '.tmp/test-image-3.jpg')}`
  )
})

test('logger', (t) => {
  const log = sinon.stub(console, 'log')
  const info = sinon.stub(console, 'info')
  const error = sinon.stub(console, 'error')

  logger.info('hello')
  logger.success('hello')
  logger.error('hello')

  sinon.assert.calledWith(log, `@post-card/core: ✅ hello`)
  sinon.assert.calledWith(info, `@post-card/core: ℹ️ hello`)
  sinon.assert.calledWith(error, `@post-card/core: ❌ hello`)

  t.pass()
})
