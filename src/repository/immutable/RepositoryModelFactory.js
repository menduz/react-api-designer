// @flow

import {List} from 'immutable'

import Path from '../Path'
import {Element, File, Directory} from '../Element'
import Repository from '../Repository'
import {FileModel, DirectoryModel, RepositoryModel, ElementModel} from './RepositoryModel'

import type {RepositoryElementType} from '../type/RepositoryType'

class RepositoryModelFactory {
  static repository(repository: Repository) {
    return new RepositoryModel(RepositoryModelFactory.directoryModel(repository.root))
  }

  static directoryModel(directory: Directory): DirectoryModel {
    const children = List.of(...directory.children)
      .map((element) => RepositoryModelFactory.elementModel(element))
      .toList()

    return DirectoryModel.directory(directory.name,
      directory.path,
      children)
  }

  static fileModel(file: File): FileModel {
    return new FileModel(file.name, file.path, file.extension,  file.dirty)
  }

  static elementModel(element: Element): ElementModel {
    return element.isDirectory()
      ? RepositoryModelFactory.directoryModel(element.asDirectory())
      : RepositoryModelFactory.fileModel(element.asFile())
  }

  static repositoryFromType(root: RepositoryElementType): RepositoryModel {
    const rootDirectory = RepositoryModelFactory.directoryFromType(root)
    return new RepositoryModel(rootDirectory)
  }

  static directoryFromType(element: RepositoryElementType): DirectoryModel {
    const originalChildren = element.children || []
    const children = originalChildren.map(RepositoryModelFactory.elementFromType)
    return DirectoryModel.directory(element.name, Path.fromString(element.path), List(children))
  }

  static fileFromType(element: RepositoryElementType): FileModel {
    return new FileModel(element.name, Path.fromString(element.path), element.extension || '',  false)
  }

  static elementFromType(element: RepositoryElementType): ElementModel {
    return element.isDirectory
      ? RepositoryModelFactory.directoryFromType(element)
      : RepositoryModelFactory.fileFromType(element)

  }
}

export default RepositoryModelFactory