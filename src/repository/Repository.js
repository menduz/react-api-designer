// @flow

import FileSystem from './file-system/FileSystem'
import type {Entry} from './file-system/FileSystem'

import Path from './Path'
import {Element, File, Directory} from './Element'
import ElementFactory from './ElementFactory'
import ZipHelper from './helper/ZipHelper'
import {zipArrays} from './helper/utils'
import type {Tuple} from './helper/utils'

// eslint-disable-next-line
export type SaveResult = {repository: Repository, file: ?File, content: ?string}

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
        const fileCount = fileDataList.length
        const count = 10
        let start = 0
        let next = count
        if (fileCount > count) {
          let result = Promise.resolve()

          while(next < fileCount) {
            let s = start
            let n = next
            result  = result.then(() => {
              return this._fileSystem.save(fileDataList.slice(s, n), false)
            })
            start = next - 1
            next = start + count
          }

          return result.then(() => {
            return this._fileSystem.save(fileDataList.slice(start, fileCount))
          }).catch(err => {
            console.error("Error saving files ", err)
            return this._fileSystem.clean().then(() => Promise.reject(err)).catch(cleanErr => {
              console.error("Error cleaning repository ", cleanErr)
              return Promise.reject(err)
            })
          })
        } else {
          return this._fileSystem.save(fileDataList)
        }
      }).then((entry): Promise<SaveResult> => {
        files.forEach(f => f.clear())
        const repository = this._updateDirectory(ElementFactory.directory(this._fileSystem, entry))
        const newFile = currentFile ? this.getFileByPath(currentFile) : null

        if (!newFile) return Promise.resolve({repository, file: undefined, content: undefined})
        else return newFile.getContent()
          .then(c => ({repository, file: newFile, content: c}))
      })
  }

  sync():Promise<any> {
    return this._fileSystem.directory(Path.fromString('')).then(entry => {
      this._updateDirectory(ElementFactory.directory(this._fileSystem, entry))
    })
  }

  saveAll(currentFile: ?Path): Promise<SaveResult> {
    return this.saveFiles(this.getDirtyFiles(), currentFile)
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
      .then(() => (file.parent && file.parent.removeChild(file)) || file)
  }

  deleteDirectory(path: Path): Promise<Directory> {
    const directory = this.getDirectoryByPath(path)
    if (!directory) return Promise.reject()
    return this._fileSystem.remove(path.toString()).then(()=> ((directory.parent &&
      directory.parent.removeChild(directory)) || directory))
  }

  addFile(path: Path, name: string, content: string): File {
    const element = this.getByPath(path)
    if (!element || !element.isDirectory())
      throw new Error(`${path.toString()} is not a valid directory`)

    const file = File.newFile(this._fileSystem, name, content, element.asDirectory())
    element.asDirectory().addChild(file)

    return file
  }

  addDirectory(path: Path, name: string): Promise<Directory> {
    const previewsElement = this.getByPath(path.append(name))
    if (previewsElement) return Promise.resolve(previewsElement.asDirectory())

    const element = this.getByPath(path)
    if (!element || !element.isDirectory()) return Promise.reject()

    const directory: Directory = element.asDirectory()
    const newDirectory = new Directory(name, [], directory)

    return this._fileSystem.createFolder(newDirectory.path.toString())
      .then(() => { directory.addChild(newDirectory) })
      .then(() => newDirectory)
  }

  move(from: Path, to: Path): Promise<Element> {
    const newParent = this.getByPath(to.parent())
    const element   = this.getByPath(from)

    if (!newParent)
      throw new Error(`New directory is not a defined`)
    else if(!newParent.isDirectory())
      throw new Error(`${newParent.path.toString()} is not a valid directory`)
    else if (!element)
      throw new Error(`${from.toString()} is not a valid directory`)

    if (!this._isMovableInFileSystem(element))
      return Promise.resolve(element.moveTo(newParent.asDirectory()))

    return this._fileSystem.rename(from.toString(), to.toString(), element.isDirectory())
      .then(() => element.moveTo(newParent.asDirectory()))
  }

  _isMovableInFileSystem(element: Element): boolean {
    if (element.isDirectory()) {
      const directory = element.asDirectory()
      return this._fileSystem.persistsEmptyFolders || !directory.isEmpty()
    } else {
      const file = element.asFile()
      return file.persisted
    }
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

  hasDirtyFiles(): boolean {
    return this.getDirtyFiles().length !== 0
  }

  getDirtyFiles(dir: ?Directory): File[] {
    const directory = dir ? dir : this._root
    let files = []

    directory.children.forEach((child: Element) => {
      if (child.isDirectory()) {
        files = files.concat(this.getDirtyFiles(child.asDirectory()))
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
    this._root = newRoot
    return this
  }
}