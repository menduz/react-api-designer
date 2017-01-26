// @flow

import {NAME} from './index';
import type {State} from './model';
import {ElementModel, DirectoryModel} from "../../repository/immutable/RepositoryModel";
import {getFileTree} from "../../repository-redux/selectors";
import {Path} from '../../repository';

export const getAll = (state: any): State => state[NAME]

export const getCurrentElement = (rootState: any): ?ElementModel => {
  const state = getAll(rootState)
  const fileTree = getFileTree(rootState)
  if (!fileTree) return

  const currentPath = state.currentPath
  if (!currentPath) return

  return fileTree.getByPath(currentPath)
}

export const getCurrentDirectory = (rootState: any): DirectoryModel => {
  const fileTree = getFileTree(rootState)
  if (!fileTree) throw new Error('File System is not loaded yet!')

  const currentElement = getCurrentElement(rootState);
  if (!currentElement) return fileTree.root

  if (currentElement.isDirectory())
    return ((currentElement: any): DirectoryModel)

  const parent = fileTree.getByPath(currentElement.path.parent())
  return parent ? ((parent: any): DirectoryModel) : fileTree.root

}