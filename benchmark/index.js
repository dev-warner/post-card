import fs from 'fs-extra'
import path from 'path';
import faker from 'faker';

import canvasNode from 'canvas';
import generate from '../dist/post-card.es.js';

const BASE_PATH = './benchmark/tmp'

class Template {
    render(item) {
        const width = 1200
        const height = 630

        const canvas = canvasNode.createCanvas(width, height)
        const context = canvas.getContext('2d')

        context.fillStyle = '#000'
        context.fillRect(0, 0, width, height)

        context.font = 'bold 70pt Menlo'
        context.textAlign = 'center'
        context.textBaseline = 'top'
        context.fillStyle = '#3574d4'

        const text = item.data.name

        const textWidth = context.measureText(text).width

        context.fillRect(600 - textWidth / 2 - 10, 170 - 5, textWidth + 20, 120)
        context.fillStyle = '#fff'
        context.fillText(text, 600, 170)

        context.fillStyle = '#fff'
        context.font = 'bold 30pt Menlo'
        context.fillText('dev-warner.io', 600, 530)

        return canvas.toBuffer()
    }
}

async function benchmark(name, length) {
    const LOTS_OF_NAMES = Array.from({ length }).map((_, index) => ({
        output: path.join(BASE_PATH, `${name}-${index}.jpg`),
        data: {
            name: faker.name.findName()
        }
    }));

    console.log(`Starting test: ${name} items: ${length}`)
    console.time(name);

    await generate(new Template(), LOTS_OF_NAMES, { concurrency: 100, verbose: true })

    console.timeEnd(name)

    fs.removeSync(path.join(process.cwd(), BASE_PATH))
}

process.on('exit', () => {
    fs.removeSync(path.join(process.cwd(), BASE_PATH))
})

process.on('beforeExit', () => {
    fs.removeSync(path.join(process.cwd(), BASE_PATH))
})

await benchmark('x-small', 1);
await benchmark('small', 10);
await benchmark('medium', 100);
await benchmark('large', 1000);
await benchmark('silly', 100000);

