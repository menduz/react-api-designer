// @flow

import {Set} from 'immutable'

import {NAME} from './index';
import type {State} from './model';
import Path from "../../repository/Path";
import {ElementModel, DirectoryModel} from "../../repository/immutable/RepositoryModel";
import {getFileTree} from "../../repository-redux/selectors";

export const getAll = (rootState: any): State => rootState.designer[NAME]

export const getExpandedFolders = (state: any): Set<Path> => getAll(state).expandedFolders

export const getCurrentPath = (state: any): ?Path => getAll(state).currentPath

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
    return currentElement.asDirectoryModel()

  const parent = fileTree.getByPath(currentElement.path.parent())
  return parent ? parent.asDirectoryModel() : fileTree.root

}
