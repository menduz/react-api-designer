// @flow

import Path from './Path'
import Directory from './Directory'
import Element from './Element'

import FileSystem from './file-system/FileSystem'

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

  save(path: Path): [Promise<any>, State] { throw new Error('Not implemented method') }

  remove(path: Path): [Promise<any>, State] {
    const promise = this._fileSystem.remove(path.toString())
    return [promise.then(() => this), new RemovedState(this._fileSystem, this._file)]
  }

  clone(file: File): State { throw new Error('Not implemented method') }

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
      return new LoadedState(this._fileSystem, this._file, content)

    this._content = content
    return this
  }

  dirty(): [boolean, State] { return [true, this] }

  save(path: Path): [Promise<any>, State] {
    const promise = this._fileSystem.save([{path: path.toString(), content: this._content}])
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

  save(path: Path): [Promise<any>, State] { return [Promise.resolve(), this] }

  clone(file: File): State { return new LoadingState(this._fileSystem, file, this._content) }
}

class EmptyState extends State {

  constructor(fileSystem: FileSystem, file: File) { super(fileSystem, file) }

  getContent(): [Promise<string>, State] {
    const contentPromise: Promise<string> = this._fileSystem.load(this._file.path.toString())
    return [contentPromise, new LoadingState(this._fileSystem, this._file, contentPromise)]
  }

  setContent(content: string): State { return new DirtyState(this._fileSystem, this._file, content) }

  dirty(): [boolean, State] { return [false, this] }

  save(path: Path): [Promise<any>, State] { return [Promise.resolve(), this] }

  clone(file: File): State { return new EmptyState(this._fileSystem, file) }
}

class RemovedState extends State {

  constructor(fileSystem: FileSystem, file: File) { super(fileSystem, file) }

  getContent(): [Promise<string>, State] { throw new Error('This file has been removed') }

  setContent(content: string): State { throw new Error('This file has been removed') }

  dirty(): [boolean, State] { throw new Error('This file has been removed') }

  save(path: Path): [Promise<any>, State] { throw new Error('This file has been removed') }

  remove(path: Path): [Promise<any>, State] { throw new Error('This file has been removed') }

  clone(file: File): State { return new RemovedState(this._fileSystem, file) }
}


class File extends Element {
  _state: State

  constructor(name: string, stateFactory: (f: File) => State, parent?: Directory) {
    super(name, parent)
    this._state = stateFactory(this)
  }

  asFile(): File { return this }

  asDirectory(): Directory { throw new Error('Trying to cast Directory to File') }

  static empty(name: string, fileSystem: FileSystem, parent?: Directory): File {
    return new File(name, (f) => new EmptyState(fileSystem, f), parent)
  }

  static dirty(fileSystem: FileSystem, name: string, content: string, parent?: Directory): File {
    return new File(name, (f) => new DirtyState(fileSystem, f, content), parent)
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

export default File