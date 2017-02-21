// @flow

import {List} from 'immutable'
import {Map} from 'immutable'

import {Path} from '../../repository'

export class RepositoryModel {
  _root: DirectoryModel

  constructor(root: DirectoryModel) { this._root = root }

  get root(): DirectoryModel { return this._root }

  static empty(): RepositoryModel {
    // eslint-disable-next-line
    return new RepositoryModel(DirectoryModel.directory('', Path.emptyPath(), List()))
  }

  getByPath(path: Path): ?ElementModel { return this._root.getByPath(path) }

  getByPathString(path: string): ?ElementModel {
    return this._root.getByPath(Path.fromString(path))
  }

  moveElement(from: Path, to: Path): RepositoryModel {
    const element = this.getByPath(from)
    if (!element) return this

    return this
      .removeElement(from)
      .updateElement(element.withPath(to))
  }

  updateElement(element: ElementModel): RepositoryModel {
    return new RepositoryModel(this._root.updateElement(element.path.parent(), element))
  }

  removeElement(path: Path): RepositoryModel {
    return new RepositoryModel(this._root.removeElement(path.parent(), path.last()))
  }
}

export class ElementModel {
  _name: string
  _path: Path

  constructor(name: string, path: Path) {
    this._name = name
    this._path = path
  }

  get name(): string { return this._name !== '' ? this._name : '/' }

  get path(): Path { return this._path }

  withPath(path: Path): DirectoryModel | ElementModel { throw new Error('Not implemented method') }

  withName(name: string): DirectoryModel | ElementModel { throw new Error('Not implemented method') }

  isDirectory(): boolean { throw new Error('Not implemented method') }

  asFileModel(): FileModel { throw new Error('Not implemented method') }

  asDirectoryModel(): DirectoryModel { throw new Error('Not implemented method') }

  getByPath(path: Path): ?ElementModel { throw new Error('Not implemented method') }
}

export class DirectoryModel extends ElementModel {
  _children: Map<string, ElementModel>

  constructor(name: string, path: Path, children: Map<string, ElementModel>) {
    super(name, path)
    this._children = children
  }

  static directory(name: string, path: Path, children: List<ElementModel>) {
    const childrenMap: Map<string, ElementModel> = Map(children.map(c => [c.name, c]))
    return new DirectoryModel(name, path, childrenMap)
  }

  isDirectory() { return true }

  get children(): List<ElementModel> { return List(this._children.values()) }

  withChildren(children: Map<string, ElementModel>): DirectoryModel {
    return new DirectoryModel(this.name, this.path, children)
  }

  withChild(child: ElementModel): DirectoryModel {
    return this.withChildren(this._children.set(child.name, child))
  }

  withPath(path: Path): DirectoryModel {
    return new DirectoryModel(this._name, path, this._children)
  }

  withName(name: string) { return new DirectoryModel(name, this.path, this._children) }

  asFileModel(): FileModel { throw new Error('Trying to cast DirectoryModel to FileModel') }

  asDirectoryModel(): DirectoryModel { return this }

  getByPath(path: Path): ?ElementModel {
    if (path.isEmpty()) return this

    const child = this._children.get(path.first())
    return child ? child.getByPath(path.shift()) : null
  }

  updateElement(parentPath: Path, element: ElementModel): DirectoryModel {
    if (parentPath.isEmpty()) return this.withChild(element)

    const child = this._children.get(parentPath.first())
    if (!child || !child.isDirectory()) throw new Error(`'${parentPath.toString()}' is not a valid path.`)

    return this.withChild(child.asDirectoryModel().updateElement(parentPath.shift(), element))
  }

  removeElement(parentPath: Path, name: string): DirectoryModel {
    if (parentPath.isEmpty()) return this.withChildren(this._children.remove(name))

    const child = this._children.get(parentPath.first())
    if (!child || !child.isDirectory()) throw new Error(`'${parentPath.toString()}' is not a valid directory.`)

    return this.withChild(child.asDirectoryModel().removeElement(parentPath.shift(), name))
  }
}

export class FileModel extends ElementModel {
  _dirty: boolean
  _extension: string

  constructor(name: string, path: Path, extension: string, dirty: boolean) {
    super(name, path)
    this._dirty = dirty
    this._extension = extension
  }

  isDirectory() { return false }

  get dirty(): boolean { return this._dirty }

  get extension(): string { return this._extension }

  asFileModel(): FileModel { return this }

  asDirectoryModel(): DirectoryModel { throw new Error('Trying to cast FileModel to DirectoryModel') }

  getByPath(path: Path): ?ElementModel { return path.isEmpty() ? this : null }

  withName(name: string) { return new FileModel(name, this._path, this._extension ,this._dirty) }

  withPath(path: Path): FileModel { return new FileModel(this._name, path, this._extension, this._dirty) }
}