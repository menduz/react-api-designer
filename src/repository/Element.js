// @flow

import Path from './Path'
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

  set parent(value: ?Directory) { this._parent = value }

  get path(): Path {
    if (!this._parent) return Path.emptyPath()
    return this._parent.path.append(this._name)
  }

  moveTo(directory: Directory): Element {
    if (this._parent) this._parent.removeChild(this)

    directory.addChild(this)
    this._parent = directory

    return this
  }

  asFile(): File { throw new Error('Not implemented method') }

  asDirectory(): Directory { throw new Error('Not implemented method') }

  isDirectory(): boolean { throw new Error('Not implemented method') }

  getByPath(path: Path): ?Element { throw new Error('Not implemented method') }

  remove(fileSystem: FileSystem): Promise<Element> { throw new Error('Not implemented method') }

  clone(parent: Directory): Element { throw new Error('Not implemented method') }
}

class State {
  _fileSystem: FileSystem
  _file: File

  constructor(fileSystem: FileSystem, file: File) {
    this._fileSystem = fileSystem
    this._file = file
  }

  getContent(): [Promise<string>, State] { throw new Error('Not implemented method') }

  setContent(content: string): State { throw new Error('Not implemented method') }

  dirty(): [boolean, State] { throw new Error('Not implemented method') }

  persisted(): [boolean, State] { throw new Error('Not implemented method') }

  save(path: Path): [Promise<any>, State] { throw new Error('Not implemented method') }

  remove(path: Path): [Promise<any>, State] {
    const promise = this._fileSystem.remove(path.toString())
    // eslint-disable-next-line
    return [promise.then(() => this), new RemovedState(this._fileSystem, this._file)]
  }

  clone(file: File): State { throw new Error('Not implemented method') }

  // eslint-disable-next-line
  clear(): State { return new EmptyState(this._fileSystem, this._file) }
}

class DirtyState extends State {
  _content: string
  _originalContent: ?string

  constructor(fileSystem: FileSystem, file: File, content: string, originalContent: ?string) {
    super(fileSystem, file)
    this._content = content
    this._originalContent = originalContent
  }

  getContent(): [Promise<string>, State] {
    return [Promise.resolve(this._content), this]
  }

  setContent(content: string): State {
    if (content === this._originalContent)
      // eslint-disable-next-line
      return new LoadedState(this._fileSystem, this._file, content)

    this._content = content
    return this
  }

  dirty(): [boolean, State] { return [true, this] }

  persisted(): [boolean, State] { return [true, this] }

  save(path: Path): [Promise<any>, State] {
    const promise = this._fileSystem.save([{path: path.toString(), content: this._content}])
    // eslint-disable-next-line
    return [promise, new LoadedState(this._fileSystem, this._file, this._content)]
  }

  clone(file: File): State { return new DirtyState(this._fileSystem, file, this._content, this._originalContent) }
}

class LoadedState extends State {
  _content: string

  constructor(fileSystem: FileSystem, file: File, content: string) {
    super(fileSystem, file)
    this._content = content
  }

  getContent(): [Promise<string>, State] { return [Promise.resolve(this._content), this] }

  setContent(content: string): State {
    return content !== this._content ? new DirtyState(this._fileSystem, this._file, content, this._content) : this
  }

  dirty(): [boolean, State] { return [false, this] }

  persisted(): [boolean, State] { return [true, this] }

  save(path: Path): [Promise<any>, State] { return [Promise.resolve(), this] }

  clone(file: File): State { return new LoadedState(this._fileSystem, file, this._content) }
}

class LoadingState extends State {
  _content: Promise<string>

  constructor(fileSystem: FileSystem, file: File, content: Promise<string>) {
    super(fileSystem, file)
    this._content = content

    content.then((result) => {
      this._file.state = new LoadedState(this._fileSystem, this._file, result)
    })
  }

  getContent(): [Promise<string>, State] { return [this._content, this] }

  setContent(content: string): State { return new DirtyState(this._fileSystem, this._file, content) }

  dirty(): [boolean, State] { return [false, this] }

  persisted(): [boolean, State] { return [true, this] }

  save(path: Path): [Promise<any>, State] { return [Promise.resolve(), this] }

  clone(file: File): State { return new LoadingState(this._fileSystem, file, this._content) }
}

class EmptyState extends State {

  getContent(): [Promise<string>, State] {
    const contentPromise: Promise<string> = this._fileSystem.load(this._file.path.toString())
    return [contentPromise, new LoadingState(this._fileSystem, this._file, contentPromise)]
  }

  setContent(content: string): State { return new DirtyState(this._fileSystem, this._file, content) }

  dirty(): [boolean, State] { return [false, this] }

  persisted(): [boolean, State] { return [true, this] }

  save(path: Path): [Promise<any>, State] { return [Promise.resolve(), this] }

  clone(file: File): State { return new EmptyState(this._fileSystem, file) }
}

class RemovedState extends State {

  getContent(): [Promise<string>, State] { throw new Error('This file has been removed') }

  setContent(content: string): State { throw new Error('This file has been removed') }

  dirty(): [boolean, State] { throw new Error('This file has been removed') }

  persisted(): [boolean, State] { throw new Error('This file has been removed') }

  save(path: Path): [Promise<any>, State] { throw new Error('This file has been removed') }

  remove(path: Path): [Promise<any>, State] { throw new Error('This file has been removed') }

  clone(file: File): State { return new RemovedState(this._fileSystem, file) }
}

class NotPersistedState extends State {
  _content: string

  constructor(fileSystem: FileSystem, file: File, content: string) {
    super(fileSystem, file)
    this._content = content
  }

  getContent(): [Promise<string>, State] { return [Promise.resolve(this._content), this] }

  setContent(content: string): State {
    this._content = content
    return this
  }

  dirty(): [boolean, State] { return [true, this] }

  persisted(): [boolean, State] { return [false, this] }

  save(path: Path): [Promise<any>, State] {
    const promise = this._fileSystem.save([{path: path.toString(), content: this._content}])
    // eslint-disable-next-line
    return [promise, new LoadedState(this._fileSystem, this._file, this._content)]
  }

  clone(file: File): State { return new NotPersistedState(this._fileSystem, file, this._content) }
}

class File extends Element {
  _state: State

  constructor(name: string, stateFactory: (f: File) => State, parent?: Directory) {
    super(name, parent)
    this._state = stateFactory(this)
  }

  asFile(): File { return this }

  asDirectory(): Directory { throw new Error('Trying to cast Directory to File') }

  static persistedFile(name: string, fileSystem: FileSystem, parent?: Directory): File {
    return new File(name, (f) => new EmptyState(fileSystem, f), parent)
  }

  static newFile(fileSystem: FileSystem, name: string, content: string, parent?: Directory): File {
    return new File(name, (f) => new NotPersistedState(fileSystem, f, content), parent)
  }

  isDirectory() { return false }

  getContent(): Promise<string> {
    const [content, newState] = this._state.getContent()
    this._state = newState
    return content
  }

  setContent(content: string): void { this._state = this._state.setContent(content) }

  get dirty(): boolean {
    const [dirty, newState] = this._state.dirty()
    this._state = newState
    return dirty
  }

  get persisted(): boolean {
    const [persisted, newState] = this._state.persisted()
    this._state = newState
    return persisted
  }

  get extension(): string { return this._name.substring(this._name.lastIndexOf('.') + 1) }

  set state(value: State) { this._state = value }

  getByPath(path: Path): ?Element { return path.isEmpty() ? this : undefined }

  save(fileSystem: FileSystem): Promise<File> {
    const [promise, newState] = this._state.save(this.path, fileSystem)
    this._state = newState
    return promise.then(() => this)
  }

  remove(fileSystem: FileSystem): Promise<File> {
    const [promise, newState] = this._state.remove(this.path, fileSystem)
    this._state = newState
    return promise.then(() => this)
  }

  clone(parent: Directory): Element { return new File(this._name, (f) => this._state.clone(f), parent) }

  clear(): void { this._state = this._state.clear() }
}

class Directory extends Element {
  _children: Map<string, Element>

  constructor(name: string, children: Element[], parent?: Directory) {
    super(name, parent)
    this._children = new Map(children.map(e => [e._name, e]))
  }

  isDirectory() {
    return true
  }

  asFile(): File { throw new Error('Trying to cast Directory to File') }

  asDirectory(): Directory { return this }

  isEmpty(): boolean {
    return this._children.size === 0
  }

  get children(): Element[] {
    return Array.from(this._children.values())
  }

  addChild(child: Element) {
    if (this._children.has(child.name)) return;

    this._children.set(child.name, child)
    return child
  }

  removeChild<T>(child: T): T {
    const element = ((child: any): Element)
    this._children
      .delete(element.name)

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
    this._children = new Map()

    const promise = fileSystem.remove(this.path.toString())
    return promise.then(() => this)
  }

  clone(parent: Directory): Element {
    const newDirectory = new Directory(this._name, [], parent)

    const newChildren = this.children
      .map(c => c.clone(newDirectory))
      .map(c => [c.name, c])
    newDirectory._children = new Map(newChildren)

    return newDirectory
  }

  fileChildren(): File[] {
    return this.children
      .filter(c => !c.isDirectory())
      .map(c => c.asFile())
  }

  directoryChildren(): Directory[] {
    return this.children
      .filter(c => c.isDirectory())
      .map(c => c.asDirectory())
  }

  mergeWith(other: Directory) {
    const dirtyFiles = other._getDirtyChildren()
    const directoryWithNoFile = other._getChildrenWithNoFiles()

    dirtyFiles.concat(directoryWithNoFile)
      .forEach((e: Element) => this.replaceChild(e))

    this.directoryChildren()
      .forEach(d => {
        const otherChild = other._child(d.name)
        if (otherChild && otherChild.isDirectory()) d.mergeWith(otherChild.asDirectory())
      })
  }

  _getDirtyChildren(): File[] {
    return this.fileChildren()
      .filter(f => f.dirty)
  }

  _getChildrenWithNoFiles(): Directory[] {
    return this.directoryChildren()
      .filter(d => !d._hasFileDescendants())
  }

  _hasFileDescendants() {
    if (this.fileChildren().length !== 0) return true
    return this.directoryChildren()
      .reduce((result, value: Directory) => result || value._hasFileDescendants(), false)
  }

  _child(name: string): ?Element {
    return this._children.get(name)
  }

  replaceChild(element: Element) {
    const child = this._child(element.name)
    if (child) this.removeChild(child)

    this.addChild(element.clone(this))
  }
}

export {
  Element,
  File,
  Directory,

  State,
  DirtyState,
  LoadingState,
  LoadedState,
  EmptyState,
  RemovedState
}