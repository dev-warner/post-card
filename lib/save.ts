import fs from 'fs-extra'

export interface ISave {
  canvas: Buffer
  output: string
}

export async function save(output: string, buffer: Buffer) {
  await fs.outputFile(output, buffer, {
    encoding: 'utf-8',
  })

  return output
}
