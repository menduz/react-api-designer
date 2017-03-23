// @flow

import FileSystem from './FileSystem'
import MemoryFileSystem from './MemoryFileSystem'

type FileSystemDirectory = {type: 'folder', name: string, children: FileSystemElement[]}
type FileSystemFile = {type: 'file', name: string, content: string}
type FileSystemElement = FileSystemDirectory | FileSystemFile

class FileSystemDirectoryFactory {
  _directory: FileSystemDirectory

  constructor(name: string) {
    this._directory = {
      type: FileSystem.FolderEntryType,
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

    return Promise.all(this._rootElements.map(e => this._addElementToFileSystem(fileSystem, e, '')))
      .then(() => fileSystem)
  }

  _addFileToFileSystem(fileSystem: FileSystem, file: FileSystemFile, currentPath: string): Promise<any> {
    return fileSystem.save([{path: currentPath + FileSystem.Separator + file.name, content: file.content}])
  }

  _addDirectoryToFileSystem(fileSystem: FileSystem, directory: FileSystemDirectory, currentPath: string): Promise<any> {
    const path = currentPath + FileSystem.Separator + directory.name
    return fileSystem.createFolder(path)
      .then(() =>
        Promise.all(directory.children.map(e => this._addElementToFileSystem(fileSystem, e, path)))
      )
  }

  _addElementToFileSystem(fileSystem: FileSystem, element: FileSystemElement, currentPath: string): Promise<any> {
    return element.type === FileSystem.FileEntryType ?
      this._addFileToFileSystem(fileSystem, element, currentPath) :
      this._addDirectoryToFileSystem(fileSystem, element, currentPath)
  }
}

export const directory = (name: string): FileSystemDirectoryFactory => {
  return new FileSystemDirectoryFactory(name)
}

export const file = (name: string, content: string): FileSystemFile => {
  return {type: FileSystem.FileEntryType, name, content}
}