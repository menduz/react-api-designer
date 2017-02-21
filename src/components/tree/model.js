// @flow

import {Set} from 'immutable'
import {Path} from '../../repository'
import {RepositoryModel, FileModel, DirectoryModel, ElementModel} from '../../repository/immutable/RepositoryModel';

export type State = {
  currentPath: ?Path,
  expandedFolders: Set<Path>
}

export type Node = {
  path: Path,
  name: string,
  isDirty: boolean,
  children?: Node[]
}

const fromFile = (file: FileModel): Node => {
  return {
    path: file.path,
    name: file.name,
    label: `${file.dirty ? '* ' : ''}${file.name}`
  }
}

const fromElement = (element: ElementModel): Node => {
  return element.isDirectory()
    // eslint-disable-next-line
    ? fromDirectory(element.asDirectoryModel())
    : fromFile(element.asFileModel())
}

const fromDirectory = (directory: DirectoryModel): Node => {
  const children = directory.children.map(fromElement).toArray();

  return {
    path: directory.path,
    name: directory.name,
    label: directory.name,
    children
  }
}

export const fromFileTree = (fileTree: RepositoryModel) : Node[] => {
  return fromDirectory(fileTree.root).children
}