// @flow

//import {PREFIX} from './index'

import {Repository} from '../../repository'
import type {Dispatch, GetState, ExtraArgs} from '../../types'
import ConsumeRemoteApi from '../../remote-api/ConsumeRemoteApi'

import * as editor from "../editor"
import {File} from "../../repository"
import {getAll} from "./selectors"
import {Path} from '../../repository'

const PREFIX = 'DEPENDENCIES_TREE'
export const CLEAN = `DESIGNER/${PREFIX}/CLEAN`
export const NODE_SELECTED = `DESIGNER/${PREFIX}/NODE_SELECTED`
export const PATH_SELECTED = `DESIGNER/${PREFIX}/PATH_SELECTED`
export const EXPAND_FOLDER = `DESIGNER/${PREFIX}/EXPAND_FOLDER`
export const NOT_EXPAND_FOLDER = `DESIGNER/${PREFIX}/NOT_EXPAND_FOLDER`
const EXCHANGE_MODULES = 'exchange_modules'

export const clean = (path: Path) => ({
  type: CLEAN
})

const buildExchangePath = ((path: Path) => {
  const first = path.first()
  return Path.fromString(path.toString().replace('/' + first, '/' + EXCHANGE_MODULES))
})

export const pathSelected = (path: Path) =>
  (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs): Promise<any> => {

    dispatch({
      type: NODE_SELECTED,
      payload: path
    })

    if (!repositoryContainer.isLoaded) return Promise.resolve()

    const repository: Repository = repositoryContainer.repository
    var exchangePath = buildExchangePath(path);
    const element = repository.getByPath(exchangePath)

    if (!element || element.isDirectory()) return Promise.resolve()

    const currentPath = editor.selectors.getCurrentFilePath(getState())
    if (currentPath === exchangePath.toString()) return Promise.resolve()

    const file: File = element.asFile()
    return file.getContent()
      .then((content) => {
        dispatch(editor.actions.updateFile(content, exchangePath))
      })
  }

export const folderSelected = (path: Path): void =>
  (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs) => {

    const repository: Repository = repositoryContainer.repository
      const directory = repository.getByPath(buildExchangePath(path))

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
  return (dispatch: Dispatch, getState: GetState, {designerRemoteApiSelectors}: ExtraArgs) => {
    //dispatch(isSubmitting()) // in progress

    const dependencies = [gav]
    const consumeRemoteApi = new ConsumeRemoteApi(designerRemoteApiSelectors(getState))
    consumeRemoteApi.removeDependencies(dependencies).then(() => {
      //dispatch(clear()) // close dialog
      //@@TODO Call job until done, then reload repository
    }).catch(err => {
      console.log('Error when removing dependency', err)
      //dispatch(showError('Error when trying to submit')) // show error in dialog
    })
  }

}