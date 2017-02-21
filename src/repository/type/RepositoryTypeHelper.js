// @flow

import type {RepositoryElementType} from './RepositoryType'

import Path from '../Path'

import RepositoryModelFactory from '../immutable/RepositoryModelFactory'
import {RepositoryModel, FileModel} from '../immutable/RepositoryModel'

class RepositoryTypeHelper {
  repository: RepositoryModel

  constructor(root: RepositoryElementType) {
    this.repository = RepositoryModelFactory.repositoryFromType(root)
  }

  directoryChildrenNames(path: string): string[] {
    const element = this.repository.getByPathString(path)
    if(!element || !element.isDirectory()) throw new Error(`${path} is not a directory`)

    return element.asDirectoryModel().children
      .map(child => child.name)
      .toArray()
  }

  isDirectory(path: string): boolean {
    const element = this.repository.getByPathString(path)
    return !!element && element.isDirectory()
  }

  exists(path: string): boolean { return !!this.repository.getByPathString(path) }

  fileDirectory(pathString: string): string {
    const path = Path.fromString(pathString)
    const element = this.repository.getByPath(path)
    if (!element || element.isDirectory()) return Path.emptyPath().toString()

    return path.parent().toString()
  }

  fileExtension(path: string): string {
    const element = this.repository.getByPathString(path)
    if(!element || element.isDirectory()) return ''

    const file: FileModel = element.asFileModel()
    return file.extension
  }
}

export default RepositoryTypeHelper