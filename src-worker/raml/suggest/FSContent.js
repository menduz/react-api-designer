// @flow

import {Path} from '../../../src/repository'

class FSContent {
  text: string
  offset: number
  path: string
  baseName: string

  constructor(text: string, offset: number, path: string) {
    this.text = text
    this.offset = offset
    this.path = path
    this.baseName = Path.fromString(this.path).last()
  }

  getText(): string { return this.text }

  getPath(): string { return this.path }

  getBaseName(): string { return this.baseName }

  getOffset(): number { return this.offset }
}

export default FSContent