// @flow

import Element from './Element'
import Path from './Path'
import FileSystem from './file-system/FileSystem'
import File from './File'

class Directory extends Element {
  _children: Element[]

  constructor(name: string, children: Element[], parent?: Directory) {
    super(name, parent)
    this._children = children
  }

  isDirectory() {
    return true
  }

  asFile(): File { throw new Error('Trying to cast Directory to File') }

  asDirectory(): Directory { return this }

  get children(): Element[] {
    return this._children
  }

  addChild(child: Element) {
    this._children.push(child)
    return child
  }

  removeChild<T>(child: T): T {
    this._children = this._children
      .filter((c) => c !== child)

    return child
  }

  getByPath(path: Path): ?Element {
    if (path.isEmpty()) return this

    const childrenResult = this.children
      .filter((e) => e.name === path.first())
      .map((e) => e.getByPath(path.shift()))

    return childrenResult.length > 0 ? childrenResult[0] : undefined
  }

  remove(fileSystem: FileSystem): Promise<Directory> {
    this._children.forEach(children => children.remove(fileSystem))
    this._children = []

    const promise = fileSystem.remove(this.path.toString())
    return promise.then(() => this)
  }

  clone(parent: Directory): Element {
    const newDirectory = new Directory(this._name, [], parent)
    newDirectory._children = this._children.map(c => c.clone(newDirectory))
    return newDirectory
  }

  _fileChildren(): File[] {
    return this._children
      .filter(c => !c.isDirectory())
      .map(c => c.asFile())
  }

  _directoryChildren(): Directory[] {
    return this._children
      .filter(c => c.isDirectory())
      .map(c => c.asDirectory())
  }

  mergeWith(other: Directory) {
    const dirtyFiles = other._getDirtyChildren()
    const directoryWithNoFile = other._getChildrenWithNoFiles()

    dirtyFiles.concat(directoryWithNoFile)
      .forEach((e: Element) => this.replaceChild(e))

    this._directoryChildren()
      .forEach(d => {
        const otherChild = other._child(d.name)
        if (otherChild && otherChild.isDirectory()) d.mergeWith(otherChild.asDirectory())
      })
  }

  _getDirtyChildren(): File[] {
    return this._fileChildren()
      .filter(f => f.dirty)
  }

  _getChildrenWithNoFiles(): Directory[] {
    return this._directoryChildren()
      .filter(d => !d._hasFileDescendants())
  }

  _hasFileDescendants() {
    if (this._fileChildren().length !== 0) return false
    return this._directoryChildren()
      .reduce((result, value: Directory) => result || value._hasFileDescendants(), false)
  }

  _child(name: string): ?Element {
    return this._children
      .find(c => c.name === name)
  }

  replaceChild(element: Element) {
    const child = this._child(element.name)
    if (child) this.removeChild(child)

    this.addChild(element.clone(this))
  }
}

export default Directory
