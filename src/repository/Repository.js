// @flow

import FileSystem from './file-system/FileSystem'
import type {Entry} from './file-system/FileSystem'

import Path from './Path'
import {Element, File, Directory} from './Element'
import ElementFactory from './ElementFactory'
import ZipHelper from './helper/ZipHelper'
import {zipArrays} from './helper/utils'
import type {Tuple} from './helper/utils'

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

    return element.asFile()
  }

  getDirectoryByPath(path: Path): ?Directory {
    const element = this.getByPath(path)
    if (!element || !element.isDirectory()) return

    return element.asDirectory()
  }

  saveFile(path: Path): Promise<File> {
    const file = this.getFileByPath(path)
    if (!file) return Promise.reject()

    return file.save(this._fileSystem)
  }

  saveFiles(files: File[], currentFile: ?Path): Promise<SaveResult> {
    return Promise.all(files.map(file => file.getContent()))
      .then(contents => {
        const tuples: Tuple<File, string>[] = zipArrays(files, contents)
        const fileDataList = tuples
          .map(t => ({path: t.first.path.toString(), content: t.second}))

        return this._fileSystem.save(fileDataList)
      }).then(entry => {
        files.forEach(f => f.clear())
        const repository = this._updateDirectory(ElementFactory.directory(this._fileSystem, entry))

        const newFile = currentFile ? this.getFileByPath(currentFile) : null
        if (!newFile) return {repository}
        return newFile.getContent()
          .then(c => ({repository, file: newFile, content: c}))
      })
  }

  saveAll(currentFile: ?Path): Promise<Repository> {
    return this.saveFiles(this._getDirtyFiles(), currentFile)
  }

  rename(path: string, newName: string): Promise<Element> {
    const element = this.getByPathString(path)
    if (!element) return Promise.reject()

    const newPath = path.substr(0, path.lastIndexOf('/') + 1) + newName
    const promise = this._fileSystem.rename(path, newPath, element.isDirectory())
    element.name = newName

    return promise
      .then(() => element)
      .catch(() => element)
  }

  deleteFile(path: Path): Promise<File> {
    const file = this.getFileByPath(path)
    if (!file) return Promise.reject()

    return file.remove(this._fileSystem)
      .then(() => file.parent.removeChild(file) )
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

    const file = File.dirty(this._fileSystem, name, content, element.asDirectory())
    element.asDirectory().addChild(file)

    return file
  }

  addDirectory(path: Path, name: string): Promise<Directory> {
    const element = this.getByPath(path)
    if (!element || !element.isDirectory()) return Promise.reject()

    const directory: Directory = element.asDirectory()
    const newDirectory = new Directory(name, [], directory)

    return this._fileSystem.createFolder(newDirectory.path.toString())
      .then(() => { directory.children.push(newDirectory) })
      .then(() => newDirectory)
  }

  move(from: Path, to: Path): Promise<Element> {
    const newParent = this.getByPath(to.parent())
    const element   = this.getByPath(from)

    if (!newParent || !newParent.isDirectory())
      throw new Error(`${newParent.path.toString()} is not a valid directory`)
    else if (!element)
      throw new Error(`${from.toString()} is not a valid directory`)

    const promise = this._fileSystem.rename(from.toString(), to.toString())

    return promise
      .then(() => {
        element.parent.removeChild(element)
        element.parent = newParent.asDirectory()
        newParent.asDirectory().addChild(element)
        return element
      })
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
    const directory = dir ? dir : this._root
    let files = []

    directory.children.forEach((child: Element) => {
      if (child.isDirectory()) {
        files = files.concat(this._getDirtyFiles(child.asDirectory()))
      } else {
        const file = child.asFile()
        if (file.dirty) files.push(file)
      }
    })
    return files
  }

  _updateDirectory(newRoot: Directory): Repository {
    const oldRoot = this._root
    newRoot.mergeWith(oldRoot)

    return this
  }
}

export type SaveResult = {repository: Repository, file: File, content: string}