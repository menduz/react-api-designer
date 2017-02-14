// @flow

import FileSystem from './file-system/FileSystem'
import type {Entry} from './file-system/FileSystem'

import Path from './Path'
import File from './File'
import Element from './Element'
import Directory from './Directory'
import ElementFactory from './ElementFactory'
import ZipHelper from './helper/ZipHelper'

export default class Repository {
  _fileSystem: FileSystem
  _root: Directory

  constructor(fileSystem: FileSystem, root: Directory) {
    this._fileSystem = fileSystem
    this._root = root
  }

  static fromFileSystem(fileSystem: FileSystem): Promise<Repository> {
    return fileSystem.directory(Path.FileSystemSeparator)
      .then((e: Entry) => new Repository(fileSystem, ElementFactory.directory(fileSystem, e)))
  }

  get root(): Directory {
    return this._root
  }

  getByPathString(path: string): ?Element {
    return this.getByPath(Path.fromString(path))
  }

  getByPath(path: Path): ?Element {
    return this._root.getByPath(path)
  }

  getFileByPath(path: Path): ?File {
    const element = this.getByPath(path)
    if (!element || element.isDirectory()) return

    return ((element: any): File)
  }

  getDirectoryByPath(path: Path): ?Directory {
    const element = this.getByPath(path)
    if (!element || !element.isDirectory()) return

    return ((element: any): Directory)
  }

  saveFile(path: Path): Promise<File> {
    const file = this.getFileByPath(path)
    if (!file) return Promise.reject()

    return file.save(this._fileSystem)
  }

  saveAll(): Promise<File[]> {
    var promises: Array<Promise> = []
    var files = this._getDirtyFiles()

    files.forEach(file => {
      var promise = file.save(this._fileSystem)
      promises.push(promise)
    })

    return Promise.all(promises).then(files => files)
  }

  rename(path: string, newName: string): Promise<Element> {
    var element = this.getByPathString(path)
    if (!element) return Promise.reject()

    const newPath = path.substr(0, path.lastIndexOf('/') + 1) + newName
    const promise = this._fileSystem.rename(path, newPath)
    element.name = newName

    return promise
      .then(() => element)
      .catch(() => element)
  }

  deleteFile(path: Path): Promise<File> {
    const file = this.getFileByPath(path)
    if (!file) return Promise.reject()

    return file.remove(this._fileSystem)
  }

  deleteDirectory(path: Path): Promise<Directory> {
    const directory = this.getDirectoryByPath(path)
    if (!directory) return Promise.reject()

    return directory.remove(this._fileSystem)
  }

  addFile(path: Path, name: string, content: string): File {
    const element = this.getByPath(path)
    if (!element || !element.isDirectory())
      throw new Error(`${path.toString()} is not a valid directory`)

    const directory = ((element: any): Directory)
    const file = File.dirty(name, content, directory)
    directory.addChild(file)

    return file
  }

  addDirectory(path: Path, name: string): Promise<Directory> {
    const element = this.getByPath(path)
    if (!element || !element.isDirectory()) return Promise.reject()

    const directory: Directory = ((element: any): Directory)
    const newDirectory = new Directory(name, [], directory)

    return this._fileSystem.createFolder(newDirectory.path.toString())
      .then(() => { directory.children.push(newDirectory) })
      .then(() => newDirectory)
  }

  move(from: Path, to: Path): Promise<Element> {
    var newParent = this.getByPath(to.parent())
    var element   = this.getByPath(from)

    if (!newParent || !newParent.isDirectory())
      throw new Error(`${newParent.path.toString()} is not a valid directory`)
    else if (!element)
      throw new Error(`${from.toString()} is not a valid directory`)

    const promise = this._fileSystem.rename(from.toString(), to.toString())
    element.parent = newParent
    newParent.addChild(element)

    return promise
      .then(() => element)
      .catch(() => element)
  }

  setContent(path: Path, content: string): File {
    const file = this.getFileByPath(path)
    if (!file)
      throw new Error(`${path.toString()} is not a valid file`)

    file.setContent(content)
    return file
  }

  buildZip():Promise<> {
    return ZipHelper.buildZip(this.root)
  }

  _getDirtyFiles(dir: ?Directory): File[] {
    var directory = dir ? dir : this._root
    var files = []

    directory.children.forEach(child => {
      if (child.isDirectory()) {
        files = files.concat(this._getDirtyFiles(child))
      } else {
        const file = (child : File)
        if (file.dirty) files.push(file)
      }
    })
    return files
  }
}