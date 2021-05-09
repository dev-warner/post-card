import fs from 'fs-extra'

export class Local {
  static image(path: string) {
    return `data:image/jpeg;base64,${fs.readFileSync(path).toString('base64')}`
  }
  static font(path: string) {
    return `url("data:font/ttf;base64,${fs
      .readFileSync(path)
      .toString('base64')}")`
  }
}
