// @flow

import {PREFIX} from './index'

import {Repository} from '../../repository'
import type {Dispatch, GetState, ExtraArgs} from '../../types'

import * as editor from "../editor"
import * as repository from "../../repository-redux"
import {File} from "../../repository"
import {getCurrentDirectory, getAll} from "./selectors"
import {Path} from '../../repository'

//const PREFIX = 'DEPENDENCY_TREE'
export const CLEAN = `DESIGNER/${PREFIX}/CLEAN`
export const NODE_SELECTED = `DESIGNER/${PREFIX}/NODE_SELECTED`
export const PATH_SELECTED = `DESIGNER/${PREFIX}/PATH_SELECTED`
export const EXPAND_FOLDER = `DESIGNER/${PREFIX}/EXPAND_FOLDER`
export const NOT_EXPAND_FOLDER = `DESIGNER/${PREFIX}/NOT_EXPAND_FOLDER`

export const clean = (path: Path) => ({
  type: CLEAN
})

export const pathSelected = (path: Path) =>
  (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs): Promise<any> => {
    dispatch({
      type: NODE_SELECTED,
      payload: path
    })

    if (!repositoryContainer.isLoaded) return Promise.resolve()

    const repository: Repository = repositoryContainer.repository
    const element = repository.getByPath(path)
    if (!element || element.isDirectory()) return Promise.resolve()

    const currentPath = editor.selectors.getCurrentFilePath(getState())
    if (currentPath === path.toString()) return Promise.resolve()

    const file: File = element.asFile()
    return file.getContent()
      .then((content) => {
        dispatch(editor.actions.updateFile(content, path))
      })
  }

export const folderSelected = (path: Path): void =>
  (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs) => {
    const repository: Repository = repositoryContainer.repository
    const directory = repository.getByPath(path)

    if (!directory || !directory.isDirectory())
      return

    const folders = getAll(getState()).expandedFolders;
    if (folders.has(path)) {
      dispatch({
        type: NOT_EXPAND_FOLDER,
        payload: path
      })
    }
    else {
      dispatch({
        type: EXPAND_FOLDER,
        payload: path
      })
    }
  }

export const addFile = (name: string, fileType: ?string, path: ?Path) =>
  (dispatch: Dispatch, getState: GetState): Promise<File> => {
    const directoryPath = path ? path : getCurrentDirectory(getState()).path
    const file: File = dispatch(repository.actions.addFile(directoryPath, name, fileType))
    return dispatch(pathSelected(directoryPath.append(name)))
      .then(ignored => {
        return Promise.resolve(file)
      })
  }

export const addDirectory = (name: string, path: ?Path) =>
  (dispatch: Dispatch, getState: GetState) => {
    const directoryPath = path ? path : getCurrentDirectory(getState()).path
    dispatch(repository.actions.addDirectory(directoryPath, name))
  }

export const move = (source: Path, destinationDir: Path) =>
  (dispatch: Dispatch) => {
    dispatch(repository.actions.moveElement(source, destinationDir))
  }
