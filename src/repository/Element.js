// @flow

import Path from './Path'
import File from './File'
import Directory from './Directory'
import FileSystem from './file-system/FileSystem'

class Element {
  _name: string
  _parent: ?Directory

  constructor(name: string, parent: ?Directory) {
    this._name = name
    this._parent = parent
  }

  get name(): string { return this._name }

  set name(name: string) { this._name = name }

  get parent(): ?Directory { return this._parent }

  set parent(value: Directory) { this._parent = value }

  get path(): Path {
    if (!this._parent) return Path.emptyPath()
    return this._parent.path.append(this._name)
  }

  asFile(): File { throw new Error('Not implemented method') }

  asDirectory(): Directory { throw new Error('Not implemented method') }

  isDirectory(): boolean { throw new Error('Not implemented method') }

  getByPath(path: Path): ?Element { throw new Error('Not implemented method') }

  remove(fileSystem: FileSystem): Promise<Element> { throw new Error('Not implemented method') }

  clone(parent: Directory): Element { throw new Error('Not implemented method') }
}

export default Element