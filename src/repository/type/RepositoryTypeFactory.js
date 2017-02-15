// @flow

import type {RepositoryElementType} from './RepositoryType'

import {DirectoryModel, RepositoryModel, FileModel, ElementModel} from '../immutable/RepositoryModel'

class RepositoryTypeFactory {
  static fromRepositoryModel(repository: RepositoryModel): RepositoryElementType {
    return RepositoryTypeFactory.fromDirectoryModel(repository.root)
  }

  static fromDirectoryModel(directory: DirectoryModel): RepositoryElementType {
    const children = directory.children
      .map(RepositoryTypeFactory.fromElementModel)
      .toArray()

    return {
      name: directory.name,
      path: directory.path.toString(),
      extension: undefined,
      isDirectory: true,
      children
    }
  }

  static fromFileModel(file: FileModel): RepositoryElementType {
    return {
      name: file.name,
      path: file.path.toString(),
      extension: file.extension,
      isDirectory: false,
      children: undefined
    }
  }

  static fromElementModel(element: ElementModel): RepositoryElementType {
    return element.isDirectory()
      ? RepositoryTypeFactory.fromDirectoryModel(((element: any): DirectoryModel))
      : RepositoryTypeFactory.fromFileModel(((element: any): FileModel))
  }
}

export default RepositoryTypeFactory