// @flow

import {FileSystem, EntryTypes, Separator} from './FileSystem'
import MemoryFileSystem from './MemoryFileSystem'

type FileSystemDirectory = {type: 'folder', name: string, children: FileSystemElement[]}
type FileSystemFile = {type: 'file', name: string, content: string}
type FileSystemElement = FileSystemDirectory | FileSystemFile

class FileSystemDirectoryFactory {
  _directory: FileSystemDirectory

  constructor(name: string) {
    this._directory = {
      type: EntryTypes.Folder,
      name: name,
      children: []
    }
  }

  withFile(file: FileSystemFile): FileSystemDirectoryFactory {
    this._directory.children.push(file)
    return this
  }

  withDirectory(directory: FileSystemDirectoryFactory): FileSystemDirectoryFactory {
    this._directory.children.push(directory.build())
    return this
  }

  build(): FileSystemDirectory {
    return this._directory
  }
}

export default class FileSystemBuilder {
  _rootElements: FileSystemElement[]

  constructor() {
    this._rootElements = []
  }

  withFile(file: FileSystemFile): FileSystemBuilder {
    this._rootElements.push(file)
    return this
  }

  withDirectory(directory: FileSystemDirectoryFactory): FileSystemBuilder {
    this._rootElements.push(directory.build())
    return this
  }

  build(initialFileSystem: ?FileSystem): Promise<FileSystem> {
    const fileSystem = initialFileSystem || MemoryFileSystem.empty()

    let promises = this._rootElements
      .map(e => FileSystemBuilder._addElementToFileSystem(fileSystem, e, ''));

    return Promise.all(promises)
      .then(() => fileSystem)
  }

  static _addFileToFileSystem(fileSystem: FileSystem, file: FileSystemFile, currentPath: string): Promise<any> {
    return fileSystem.save([{path: currentPath + Separator + file.name, content: file.content}])
  }

  static _addDirectoryToFileSystem(fileSystem: FileSystem, directory: FileSystemDirectory, currentPath: string): Promise<any> {
    const path = currentPath + Separator + directory.name
    return fileSystem.createFolder(path)
      .then(() =>
        Promise.all(directory.children.map(e => FileSystemBuilder._addElementToFileSystem(fileSystem, e, path)))
      )
  }

  static _addElementToFileSystem(fileSystem: FileSystem, element: FileSystemElement, currentPath: string): Promise<any> {
    return element.type === EntryTypes.File ?
      FileSystemBuilder._addFileToFileSystem(fileSystem, element, currentPath) :
      FileSystemBuilder._addDirectoryToFileSystem(fileSystem, element, currentPath)
  }
}

export const directory = (name: string): FileSystemDirectoryFactory => {
  return new FileSystemDirectoryFactory(name)
}

export const file = (name: string, content: string): FileSystemFile => {
  return {type: EntryTypes.File, name, content}
}