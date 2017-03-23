// @flow

//import {PREFIX} from './index'

import {Repository} from '../../repository'
import type {Dispatch, GetState, ExtraArgs} from '../../types'

import * as editor from "../editor"
import {File} from "../../repository"
import {getAll} from "./selectors"
import {Path} from '../../repository'
import {removeExchangeDependency} from '../../repository-redux/actions'

const PREFIX = 'DEPENDENCIES_TREE'
export const CLEAN = `DESIGNER/${PREFIX}/CLEAN`
export const NODE_SELECTED = `DESIGNER/${PREFIX}/NODE_SELECTED`
export const PATH_SELECTED = `DESIGNER/${PREFIX}/PATH_SELECTED`
export const EXPAND_FOLDER = `DESIGNER/${PREFIX}/EXPAND_FOLDER`
export const NOT_EXPAND_FOLDER = `DESIGNER/${PREFIX}/NOT_EXPAND_FOLDER`

export const clean = (path: Path) => ({
  type: CLEAN
})

export const pathSelected = (path: Path, filePath: Path) =>
  (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs): Promise<any> => {

    dispatch({
      type: NODE_SELECTED,
      payload: path
    })

    if (!repositoryContainer.isLoaded) return Promise.resolve()

    const repository: Repository = repositoryContainer.repository
    const element = repository.getByPath(filePath)

    if (!element || element.isDirectory()) return Promise.resolve()

    const currentPath = editor.selectors.getCurrentFilePath(getState())
    if (currentPath === filePath.toString()) return Promise.resolve()

    const file: File = element.asFile()
    return file.getContent()
      .then((content) => {
        dispatch(editor.actions.updateFile(content, filePath))
      })
  }

export const folderSelected = (path: Path, filePath: Path): void =>
  (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs) => {

    const repository: Repository = repositoryContainer.repository
      const directory = repository.getByPath(filePath)

    if (!directory || !directory.isDirectory())
      return

    const folders = getAll(getState()).expandedFolders;
    if (folders.has(path.toString())) {
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


export const removeDependency = (gav: any): void => {
  return (dispatch: Dispatch) => {
    dispatch(removeExchangeDependency(gav))
  }

}