// @flow

import {NAME} from './index'
import {Path} from '../repository'
import {RepositoryModel} from '../repository/immutable'
import {getCurrentFilePath} from '../components/editor/selectors'
import type {State} from './model'

export const getAll = (rootState: any): State => rootState.designer[NAME]

export const getFileTree = (rootState: any): ?RepositoryModel => getAll(rootState).fileTree

export const getProgress = (rootState: any): ?RepositoryModel => getAll(rootState).progress

export const getFileContent = (rootState: any) => (path: Path): ?string => {
  const state = getAll(rootState)
  return state.contents.get(path.toString()) || ''
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

export const numberOfDependencies = (rootState: any): number => {
  const state = getAll(rootState)
  const fileTree: ?RepositoryModel = state.fileTree
  if (!fileTree) return 0

  const exchangeModules = fileTree.getByPathString('/exchange_modules')
  if (!exchangeModules || !exchangeModules.isDirectory() ) return 0

  return exchangeModules.asDirectoryModel().children.size
}

export const dependencyPaths = (rootState: any): string[] => {
  const state = getAll(rootState)
  const fileTree: ?RepositoryModel = state.fileTree
  if (!fileTree) return []

  const exchangeModules = fileTree.getByPathString('/exchange_modules')
  if (!exchangeModules || !exchangeModules.isDirectory() ) return []

  return exchangeModules.asDirectoryModel().children.map(c => c.path.toString()).toArray()
}