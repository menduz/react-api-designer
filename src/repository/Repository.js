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
    var files = this._getDirtyFiles()
    this._updateSavedFiles(files)

    var promises: Array<Promise> = []

    files.forEach(file => {
      var promise = file.save(this._fileSystem)
      promises.push(promise)
    })

    return Promise.all(promises)
  }

  rename(oldName: string, newName: string): Promise<any> {
    const element = this.getByPathString(oldName);
    if (element)
      element.name = newName

    const newCompleteName = oldName.substr(0, oldName.lastIndexOf('/') + 1) + newName

    const promise = this._fileSystem.rename(oldName, newCompleteName);
    return promise
      .then(
        () => this,
        () => this
      )
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

  _getDirtyFiles(): File[] {
    function getDirtyChildren(dir: Directory): Array<Element>{
      var children = []

      dir.children.forEach(child => {
        if (child.isDirectory()) {
          children = children.concat(getDirtyChildren(child))
        } else {
          const file = (child : File)
          if (file.dirty) { children.push(child) }
        }
      })

      return children
    }

    var files = []

    this._root.children.forEach(child => {
      if (child.isDirectory()) {
        files = files.concat(getDirtyChildren(child))
      } else {
        const file = (child : File)
        if (file.dirty) files.push(file)
      }
    })
    return files
  }

  _updateSavedFiles(files: File[]): void {
    files.forEach(file => file.saveState())
  }
}