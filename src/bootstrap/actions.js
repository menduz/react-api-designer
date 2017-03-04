import type {Dispatch, GetState, ExtraArgs} from '../types'
import Repository from "../repository/Repository";
import FileSystem from '../repository/file-system/FileSystem'
import FileTreeFactory from "../repository/immutable/RepositoryModelFactory";
import VcsFileSystem from "../repository/file-system/VcsFileSystem";
import LocalStorageFileSystem from "../repository/file-system/LocalStorageFileSystem";
import VcsRemoteApi from "../remote-api/VcsRemoteApi";
import {actions as editorActions} from "../components/editor";
import {actions as treeActions} from "../components/tree";
import {actions as repositoryActions} from "../repository-redux";
import {addErrorToasts} from '../components/toasts/actions'
import {INITIALIZED, CLEAN, INITIALIZING} from './constants'

export const clean = () =>
  (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs): any => {
    repositoryContainer.isLoaded = false
    repositoryContainer.repository = undefined
    dispatch(editorActions.clean())
    dispatch(treeActions.clean())
    dispatch(repositoryActions.loadingFileSystem())
    dispatch({type: CLEAN})
  }


export const init = (projectId: string = '') =>
  (dispatch: Dispatch, getState: GetState, {repositoryContainer, designerRemoteApiSelectors, designerWorker}: ExtraArgs): any => {

    // clean old state
    dispatch(clean())
    // mark as initializing with proper project id
    dispatch({type: INITIALIZING, payload: projectId})


    // Create file system
    const fileSystem: FileSystem =
      projectId ?
        new VcsFileSystem(new VcsRemoteApi(designerRemoteApiSelectors(getState))) :
        new LocalStorageFileSystem()


    // Load Repository
    Repository.fromFileSystem(fileSystem)
      .then((repository) => {
        repositoryContainer.isLoaded = true
        repositoryContainer.repository = repository
        return repository
      })
      .then((repository) => {
        dispatch(repositoryActions.initFileSystem(FileTreeFactory.repository(repository)))
        dispatch({type: INITIALIZED})
      }).catch(error => {
        dispatch(addErrorToasts(error.message || error))
      })

    // trigger the lazy load of the worker as soon as the designer opens
    designerWorker.load()
  }