import type {Dispatch, GetState, ExtraArgs} from '../types'
import Repository from "../repository/Repository";
import FileTreeFactory from "../repository/immutable/RepositoryModelFactory";
import FileSystem from "../repository/file-system/FileSystem";
import ElectronFileSystem from "../repository/file-system/ElectronFileSystem";
import VcsFileSystem from "../repository/file-system/VcsFileSystem";
import LocalStorageFileSystem from "../repository/file-system/LocalStorageFileSystem";
import VcsRemoteApi from "../remote-api/VcsRemoteApi";
import {actions as editorActions} from "../components/editor";
import {actions as treeActions} from "../components/tree";
import {actions as repositoryActions} from "../repository-redux";
import {actions as dependencyActions} from "../components/dependencies-tree";
import {addErrorToasts} from '../components/toasts/actions'
import type {ProjectType} from '../bootstrap/model'
import {API_PROJECT} from '../bootstrap/model'
import {INITIALIZED, CLEAN, INITIALIZING} from './constants'

export const clean = () =>
  (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs): any => {
    repositoryContainer.isLoaded = false
    repositoryContainer.repository = undefined
    dispatch(editorActions.clean())
    dispatch(treeActions.clean())
    dispatch(dependencyActions.clean())
    dispatch(repositoryActions.loadingFileSystem())
    dispatch({type: CLEAN})
  }

const initWithFileSytem = (fs: FileSystem, dispatch: Dispatch, {repositoryContainer, designerWorker}: ExtraArgs,
                           projectId: string = '', projectType: ProjectType = API_PROJECT): any => {

  // clean old state
  dispatch(clean())
  // mark as initializing with proper project id
  dispatch({type: INITIALIZING, payload: {projectId, projectType}})

  Repository.fromFileSystem(fs)
    .then((repository) => {
      repositoryContainer.isLoaded = true
      repositoryContainer.repository = repository
      return repository
    })
    .then((repository) => {
      dispatch(repositoryActions.initFileSystem(FileTreeFactory.repository(repository)))
      dispatch({type: INITIALIZED})
      // trigger the lazy load of the worker as soon as the designer opens
      designerWorker.load()
    }).catch(error => {
      dispatch(addErrorToasts(error))
  })
}

export const init = (projectId: string, projectType: ProjectType) =>
  (dispatch: Dispatch, getState: GetState, {repositoryContainer, designerWorker, designerRemoteApiSelectors}: ExtraArgs): any => {
    const repository = new VcsFileSystem(new VcsRemoteApi(designerRemoteApiSelectors(getState)))
    initWithFileSytem(repository, dispatch, {repositoryContainer, designerWorker}, projectId, projectType)
  }


export const initLocalStorage = () =>
  (dispatch: Dispatch, getState: GetState, {repositoryContainer, designerWorker}: ExtraArgs): any => {
    const repository = new LocalStorageFileSystem()
    initWithFileSytem(repository, dispatch, {repositoryContainer, designerWorker})
  }


export const initElectron = (basePath: string) =>
  (dispatch: Dispatch, getState: GetState, {repositoryContainer, designerWorker}: ExtraArgs): any => {
    const repository = new ElectronFileSystem(basePath)
    initWithFileSytem(repository, dispatch, {repositoryContainer, designerWorker})
  }

  export const initCustom = (repository) =>
  (dispatch: Dispatch, getState: GetState, {repositoryContainer, designerWorker}: ExtraArgs): any => {
    initWithFileSytem(repository, dispatch, {repositoryContainer, designerWorker})
  }