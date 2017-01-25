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
import {initFileSystem} from "./repository-redux/actions"
import FileTreeFactory from "./repository-redux/model/FileTreeFactory"
import * as fileSystemTree from "./components/tree"
import File from "./repository/File";

type RepositoryContainer = {
  repository: ?Repository,
  isLoaded: boolean
}

class RepositoryMock {
  repositoryContainer: RepositoryContainer

  constructor(repositoryContainer) {
    this.repositoryContainer = repositoryContainer
  }

  getFile(path): Promise<string> {
    const repository = this.repositoryContainer.repository;
    const byPathString = repository && repository.getByPathString(path);
    if (byPathString && !byPathString.isDirectory()) {
      const file = ((byPathString: any): File);
      return file.getContent()
    } else {
      return Promise.resolve('')
    }
  }
}

const repositoryContainer = {
  repository: undefined,
  isLoaded: false
}

const repositoryMock = new RepositoryMock(repositoryContainer)
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
  dialogs: combineReducers({
    newFolder: newFolder.reducer,
    newFile: newFile.reducer,
    import: importModal.reducer,
    export: exportModal.reducer
  }),
  mock: mockReducer

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
    store.dispatch(initFileSystem(FileTreeFactory.fileTree(repository)))
  })

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
