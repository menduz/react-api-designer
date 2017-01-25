// @flow

import {NAME} from './index'
import {FileTree} from './model/FileTree'
import {Path} from '../repository'

import type {State} from './model/State'

export const getAll = (rootState: any): State => rootState[NAME]

export const getFileTree = (rootState: any): ?FileTree => getAll(rootState).fileTree

export const getFileContent = (rootState: any) => (path: Path): ?string => {
  const state = getAll(rootState)
  return state.contents.get(path.toString())
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