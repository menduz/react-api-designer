//@flow

import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/app/App'
import './index.css'
import {createStore, applyMiddleware, combineReducers} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import reduxLogger from 'redux-logger'
import Repository from "./repository/Repository"
import LocalStorageFileSystem from "./repository/file-system/LocalStorageFileSystem"
import * as editor from './components/editor'
import * as repository from './repository-redux'
import mockReducer from './components/mock/reducers'
import WebWorker from './webworker'
import newFolder from './components/modal/new-folder'
import newFile from './components/modal/new-file'
import importModal from './components/modal/import'
import exportModal from './components/modal/export'
import rename from './components/modal/rename'
import {initFileSystem} from "./repository-redux/actions"
import FileTreeFactory from "./repository/immutable/RepositoryModelFactory"
import * as fileSystemTree from "./components/tree"
import FileProvider from './webworker/FileProvider'
import type {RepositoryContainer} from './RepositoryContainer'
import * as header from './components/header'
import publishApi from './components/modal/publish-api'
import VcsFileSystem from './repository/file-system/VcsFileSystem'
import VcsRemoteApi from './vcs-api/VcsRemoteApi'

const repositoryContainer: RepositoryContainer = {
  repository: undefined,
  isLoaded: false
}

const repositoryMock = new FileProvider(repositoryContainer)
const worker = new WebWorker(repositoryMock)

let thunkMiddleware = thunk.withExtraArgument({
  worker,
  repositoryContainer
})

const middleware = [thunkMiddleware]
if (location.search.indexOf('redux-logger=true') > -1) {
  middleware.push(reduxLogger())
}

const rootReducer = combineReducers({
  [repository.NAME]: repository.reducer,
  [editor.NAME]: editor.reducer,
  [fileSystemTree.NAME]: fileSystemTree.reducer,
  [publishApi.constants.NAME]: publishApi.reducer,
  dialogs: combineReducers({
    newFolder: newFolder.reducer,
    newFile: newFile.reducer,
    import: importModal.reducer,
    export: exportModal.reducer,
    rename: rename.reducer
  }),
  mock: mockReducer,
  configuration: header.reducer
})

const store = createStore(
  rootReducer,
  applyMiddleware(...middleware)
)

// Load Repository

const baseUrl = localStorage.getItem('baseUrl') // || 'https://dev.anypoint.mulesoft.com/designcenter/api-designer'
const projectId = localStorage.getItem('projectId') // || 'f69c9a09-0a17-44fe-860a-b076a44c31b8'
const ownerId = localStorage.getItem('ownerId') // || 'd365610a-8e56-42da-a3fc-73b548371cc6'
const organizationId = localStorage.getItem('organizationId') // || 'b13cbf39-787d-4d1f-9c72-22275ecc0d59'

const fileSystem = baseUrl && projectId && ownerId && organizationId ?
  new VcsFileSystem(new VcsRemoteApi(baseUrl, projectId, ownerId, organizationId)):
  new LocalStorageFileSystem()

Repository.fromFileSystem(fileSystem)
  .then((repository) => {
    repositoryContainer.repository = repository
    repositoryContainer.isLoaded = true
    return repository
  })
  .then((repository) => {
    store.dispatch(initFileSystem(FileTreeFactory.repository(repository)))
  })

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
