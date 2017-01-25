// @flow

import {Set} from 'immutable'

import {Path} from '../../repository';
import {FileTree, FileModel, DirectoryModel, ElementModel} from '../../repository-redux/model/FileTree';

export type State = {
  currentPath: ?Path,
  expandedFiles: Set<string>
}

export type Node = {
  module: string,
  path: Path,
  isDirectory: boolean,
  isDirty: boolean,
  collapsed: ?boolean,
  children: ?Node[],
  leaf: ?boolean
}

export const fromFileTree = (fileTree: FileTree) => (expandedFiles: Set<string>): Node => {
  return fromDirectory(expandedFiles)(fileTree.root)
}

const fromElement = (expandedFiles: Set<string>) => (element: ElementModel): Node => {
  return element.isDirectory()
    ? fromDirectory(expandedFiles)(((element: any): DirectoryModel))
    : fromFile(((element: any): FileModel))
}

const fromDirectory = (expandedFiles: Set<string>) => (directory: DirectoryModel): Node => {
  const children = directory.children
    .map(fromElement(expandedFiles))
    .toArray();
  return {
    module: directory.name,
    path: directory.path,
    isDirectory: false,
    isDirty: false,
    collapsed: expandedFiles.contains(directory.path.toString()),
    children,
    leaf: false
  }
}

const fromFile = (file: FileModel): Node => {
  return {
    module: file.name,
    path: file.path,
    isDirectory: false,
    isDirty: file.dirty,
    collapsed: undefined,
    children: undefined,
    leaf: true
  }
}