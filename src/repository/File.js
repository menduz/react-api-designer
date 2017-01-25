// @flow

import Path from './Path'
import Element from './Element'
import Directory from './Directory'

import FileSystem from './file-system/FileSystem'

class State {
  getContent(): [Promise<string>, State] { throw new Error('Not implemented method') }

  setContent(content: string): State { throw new Error('Not implemented method') }

  dirty(): [boolean, State] { throw new Error('Not implemented method') }

  save(path: Path, fileSystem: FileSystem): [Promise<any>, State] { throw new Error('Not implemented method') }
}

class DirtyState extends State {
  _content: string
  _originalContent: ?string

  constructor(content: string, originalContent: ?string) {
    super()
    this._content = content
    this._originalContent = originalContent
  }

  getContent(): [Promise<string>, State] {
    return [Promise.resolve(this._content), this]
  }

  setContent(content: string): State {
    if (content == this._originalContent)
      return new LoadedState(content)

    this._content = content
    return this
  }

  dirty(): [boolean, State] {
    return [true, this]
  }

  save(path: Path, fileSystem: FileSystem): [Promise<any>, State] {
    const promise = fileSystem.save(path.toString(), this._content)
    return [promise, new LoadedState(this._content)]
  }
}

class LoadedState extends State {
  _content: string

  constructor(content: string) {
    super()
    this._content = content
  }

  getContent(): [Promise<string>, State] {
    return [Promise.resolve(this._content), this]
  }

  setContent(content: string): State {
    return content !== this._content ? new DirtyState(content, this._content) : this
  }

  dirty(): [boolean, State] {
    return [false, this]
  }

  save(path: Path, fileSystem: FileSystem): [Promise<any>, State] {
    return [Promise.resolve(), this]
  }
}

class LoadingState extends State {
  _file: File
  _content: Promise<string>

  constructor(file: File, content: Promise<string>) {
    super()
    this._file = file
    this._content = content

    content.then((result) => {
      this._file.state = new LoadedState(result)
    })
  }

  getContent(): [Promise<string>, State] {
    return [this._content, this]
  }

  setContent(content: string): State {
    return new DirtyState(content)
  }

  dirty(): [boolean, State] {
    return [false, this]
  }

  save(path: Path, fileSystem: FileSystem): [Promise<any>, State] {
    return [Promise.resolve(), this]
  }
}

class EmptyState extends State {
  _file: File
  _fileSystem: FileSystem

  constructor(file: File, fileSystem: FileSystem) {
    super()
    this._file = file
    this._fileSystem = fileSystem
  }

  getContent(): [Promise<string>, State] {
    const contentPromise: Promise<string> = this._fileSystem.load(this._file.path.toString())
    return [contentPromise, new LoadingState(this._file, contentPromise)]
  }

  setContent(content: string): State {
    return new DirtyState(content)
  }

  dirty(): [boolean, State] {
    return [false, this]
  }

  save(path: Path, fileSystem: FileSystem): [Promise<any>, State] {
    return [Promise.resolve(), this]
  }
}

class File extends Element {
  _state: State

  constructor(name: string, stateFactory: (f: File) => State, parent?: Directory) {
    super(name, parent)
    this._state = stateFactory(this)
  }

  static empty(name: string, fileSystem: FileSystem, parent?: Directory): File {
    return new File(name, (f) => new EmptyState(f, fileSystem), parent)
  }

  static dirty(name: string, content: string, parent?: Directory): File {
    return new File(name, () => new DirtyState(content), parent)
  }

  isDirectory() {
    return false
  }

  getContent(): Promise<string> {
    const [content, newState] = this._state.getContent()
    this._state = newState
    return content
  }

  setContent(content: string): void {
    this._state = this._state.setContent(content)
  }

  get dirty(): boolean {
    const [dirty, newState] = this._state.dirty()
    this._state = newState
    return dirty
  }

  set state(value: State) {
    this._state = value
  }

  getByPath(path: Path): ?Element {
    return path.isEmpty() ? this : undefined
  }

  save(fileSystem: FileSystem): Promise<File> {
    const [promise, newState] = this._state.save(this.path, fileSystem)
    this._state = newState
    return promise.then(() => this)
  }
}

export default File