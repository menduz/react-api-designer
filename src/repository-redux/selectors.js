// @flow

import {NAME} from './index'
import {Path} from '../repository'
import {RepositoryModel} from '../repository/immutable'
import {getCurrentFilePath} from '../components/editor/selectors'
import type {State} from './model'

export const getAll = (rootState: any): State => rootState.designer[NAME]

export const getFileTree = (rootState: any): ?RepositoryModel => getAll(rootState).fileTree

export const getDependenciesTree = (rootState: any): ?RepositoryModel => getAll(rootState).dependenciesTree

export const getProgress = (rootState: any): ?RepositoryModel => getAll(rootState).progress

export const getFileContent = (rootState: any) => (path: Path): ?string => {
  const state = getAll(rootState)
  return state.contents.get(path.toString())
}

export const getCurrentFileContent = (rootState: any) => (): ?string => {
  const currentPath = getCurrentFilePath(rootState)
  return currentPath ? getFileContent(rootState)(currentPath) : ''
}

export const isValidDirectory = (rootState: any) => (path: Path): boolean => {
  const state = getAll(rootState)
  if (!state.fileTree) return false

  const element = state.fileTree.getByPath(path)
  return !!element && element.isDirectory()
}

export const isValidFile = (rootState: any) => (path: Path): boolean => {
  const state = getAll(rootState)
  if (!state.fileTree) return false

  const element = state.fileTree.getByPath(path)
  return !!element && !element.isDirectory()
}