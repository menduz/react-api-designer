// @flow

import {Set} from 'immutable'
import {Path} from '../../repository'
import {RepositoryModel, FileModel, DirectoryModel, ElementModel} from '../../repository/immutable/RepositoryModel';

export type State = {
  currentPath?: Path,
  expandedFolders: Set<Path>
}

export type LeafNode = { path: Path, name: string, label: string }
export type NonLeafNode = { path: Path, name: string, label: string, children: Node[] }
export type Node = LeafNode | NonLeafNode

const fromFile = (file: FileModel): LeafNode => {
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

const fromDirectory = (directory: DirectoryModel, filterFn?: (c: ElementModel) => boolean): NonLeafNode => {
  const children = directory.children
    .sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (b.isDirectory() && !a.isDirectory()) return 1;
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    })
    .filter(c => filterFn ? filterFn(c) : true)
    .map(fromElement)
    .toArray();

  return {
    path: directory.path,
    name: directory.name,
    label: directory.name,
    children
  }
}

export const fromFileTree = (fileTree: RepositoryModel): Node[] => {
  return fromDirectory(fileTree.root, c => c.name !== 'exchange.json').children
}