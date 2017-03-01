import type {Dispatch, GetState, ExtraArgs} from '../types'
import Repository from "../repository/Repository";
import FileSystem from '../repository/file-system/FileSystem'
import {initFileSystem, loadingFileSystem} from "../repository-redux/actions";
import FileTreeFactory from "../repository/immutable/RepositoryModelFactory";
import VcsFileSystem from "../repository/file-system/VcsFileSystem";
import LocalStorageFileSystem from "../repository/file-system/LocalStorageFileSystem";
import VcsRemoteApi from "../remote-api/VcsRemoteApi";
import type {RemoteApiDataProvider} from "../remote-api/model";
import {INIT, CLEAN, INITIALIZING} from './constants'


export const clean = (remoteApiDataProvider: ?RemoteApiDataProvider) =>
  (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs): any => {
    repositoryContainer.isLoaded = false
    repositoryContainer.repository = undefined
    dispatch({type: CLEAN})
  }


export const init = (remoteApiDataProvider: ?RemoteApiDataProvider) =>
  (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs): any => {

    repositoryContainer.isLoaded = false
    repositoryContainer.repository = undefined
    dispatch({type: INITIALIZING})
    dispatch(loadingFileSystem())


    // Create file system
    const fileSystem: FileSystem =
      remoteApiDataProvider ?
        new VcsFileSystem(new VcsRemoteApi(remoteApiDataProvider)) :
        new LocalStorageFileSystem()


    // Load Repository
    Repository.fromFileSystem(fileSystem)
      .then((repository) => {
        repositoryContainer.isLoaded = true
        repositoryContainer.repository = repository
        return repository
      })
      .then((repository) => {
        dispatch(initFileSystem(FileTreeFactory.repository(repository)))
        dispatch({type: INIT, payload: remoteApiDataProvider})
      })
  }