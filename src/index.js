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

Repository.fromFileSystem(new LocalStorageFileSystem())
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
