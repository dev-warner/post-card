import fs from 'fs-extra'
import path from 'path';
import faker from 'faker';

import { PostCard } from '../dist/@dev-warner/post-card.es.js';

const BASE_PATH = './benchmark/tmp'

class Template {
    render(item) {
        return `<h1>${item.data.name}</h1>`
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
    await PostCard.batch(new Template(), LOTS_OF_NAMES)
    console.timeEnd(name)

    fs.removeSync(path.join(process.cwd(), BASE_PATH))
}

process.on('exit', () => {
    fs.removeSync(path.join(process.cwd(), BASE_PATH))
})

await benchmark('x-small', 1);
await benchmark('small', 10);
await benchmark('medium', 100);
await benchmark('large', 1000);
await benchmark('silly', 100000);

