// @flow

//import {PREFIX} from './index'

import {Repository} from '../../repository'
import type {Dispatch, GetState, ExtraArgs} from '../../types'

import * as editor from "../editor"
import {File} from "../../repository"
import {getAll} from "./selectors"
import {Path} from '../../repository'
import {initFileSystem, REPOSITORY_NOT_LOADED} from '../../repository-redux/actions'
import Factory from '../../repository/immutable/RepositoryModelFactory'
import {addErrorToasts} from "../toasts/actions";
import ConsumeRemoteApi from "../../remote-api/ConsumeRemoteApi";


const PREFIX = 'DEPENDENCIES_TREE'
export const CLEAN = `DESIGNER/${PREFIX}/CLEAN`
export const NODE_SELECTED = `DESIGNER/${PREFIX}/NODE_SELECTED`
export const PATH_SELECTED = `DESIGNER/${PREFIX}/PATH_SELECTED`
export const EXPAND_FOLDER = `DESIGNER/${PREFIX}/EXPAND_FOLDER`
export const NOT_EXPAND_FOLDER = `DESIGNER/${PREFIX}/NOT_EXPAND_FOLDER`
export const UPDATE_DEPENDENCIES_STARTED = `DESIGNER/${PREFIX}/UPDATE_DEPENDENCIES_STARTED`
export const UPDATE_DEPENDENCIES_FAILED = `DESIGNER/${PREFIX}/UPDATE_DEPENDENCIES_FAILED`
export const UPDATE_DEPENDENCIES_DONE = `DESIGNER/${PREFIX}/UPDATE_DEPENDENCIES_DONE`


const error = (type: string, errorMessage: string) =>
  (dispatch: Dispatch) => {
    dispatch({type, payload: errorMessage})
    dispatch(addErrorToasts(errorMessage))
  }

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


//@@TODO LECKO This is a workaround, because get from job can return that it is finished when it isn't...
const syncDoneWorkAround = (repository, retryCount = 0): Promise<Any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(repository.sync().then(() => {
        if (repository.getByPathString('.exchange_modules_tmp') && retryCount < 5) {
          return syncDoneWorkAround(repository, retryCount + 1)
        } else {
          resolve()
        }
      }))
    }, 2000)
  })
}

const exchangeJob = (consumeRemoteApi: ConsumeRemoteApi, repository: Repository): Promise<any> => {
  return consumeRemoteApi.jobStatus().then(r => {
    if (r.status !== 'done') {
      return exchangeJob(consumeRemoteApi, repository)
    } else {
      return syncDoneWorkAround(repository)
    }
  })
}

export const removeDependency = (gav: any) =>
  (dispatch: Dispatch, getState: GetState, {repositoryContainer, designerRemoteApiSelectors}: ExtraArgs): void => {
    if (!repositoryContainer.isLoaded)
      return Promise.reject(dispatch(error(UPDATE_DEPENDENCIES_FAILED, REPOSITORY_NOT_LOADED)))

    const repository: Repository = (repositoryContainer.repository: Repository)

    dispatch({type: UPDATE_DEPENDENCIES_STARTED})

    const dependencies = [gav]
    const consumeRemoteApi = new ConsumeRemoteApi(designerRemoteApiSelectors(getState))
    consumeRemoteApi.removeDependencies(dependencies).then(() => {
      return exchangeJob(consumeRemoteApi, repository).then((fileTree) => {
        dispatch(initFileSystem(Factory.repository(repository)))
        dispatch({type: UPDATE_DEPENDENCIES_DONE})
      })
    }).catch(err => {
      console.error('Error removing dependencies', error)
      dispatch(error(UPDATE_DEPENDENCIES_FAILED, err))
    })
  }

export const addExchangeDependency = (dependencies: any) =>
  (dispatch: Dispatch, getState: GetState, {repositoryContainer, designerRemoteApiSelectors}: ExtraArgs): Promise<any> => {
    if (!repositoryContainer.isLoaded)
      return Promise.reject(dispatch(error(UPDATE_DEPENDENCIES_FAILED, REPOSITORY_NOT_LOADED)))

    const repository: Repository = (repositoryContainer.repository: Repository)
    const consumeRemoteApi = new ConsumeRemoteApi(designerRemoteApiSelectors(getState))
    return consumeRemoteApi.addDependencies(dependencies).then(() => {
      return exchangeJob(consumeRemoteApi, repository).then((fileTree) => {
        dispatch(initFileSystem(Factory.repository(repository)))
        dispatch({type: UPDATE_DEPENDENCIES_DONE})
      })
    }).catch(err => {
      console.error('Error adding dependency', error)
      dispatch(error(UPDATE_DEPENDENCIES_FAILED, err))
    })
  }