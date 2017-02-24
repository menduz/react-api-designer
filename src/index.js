//@flow

import React from "react";
import ReactDOM from "react-dom";
import App from "./components/app/App";
import "./index.css";
import {createStore, applyMiddleware, combineReducers} from "redux";
import {Provider} from "react-redux";
import thunk from "redux-thunk";
import reduxLogger from "redux-logger";
import Repository from "./repository/Repository";
import LocalStorageFileSystem from "./repository/file-system/LocalStorageFileSystem";
import * as editor from "./components/editor";
import * as repository from "./repository-redux";
import mockReducer from "./components/mock/reducers";
import WebWorker from "./webworker";
import newFolder from "./components/modal/new-folder";
import newFile from "./components/modal/new-file";
import importModal from "./components/modal/import";
import exportModal from "./components/modal/export";
import rename from "./components/modal/rename";
import {initFileSystem} from "./repository-redux/actions";
import FileTreeFactory from "./repository/immutable/RepositoryModelFactory";
import * as fileSystemTree from "./components/tree";
import FileProvider from "./webworker/FileProvider";
import type {RepositoryContainer} from "./RepositoryContainer";
import type {XApiDataProvider} from "./vcs-api/XApiDataProvider";
import * as header from "./components/header";
import publishApi from "./components/modal/publish-api";
import VcsFileSystem from "./repository/file-system/VcsFileSystem";
import VcsRemoteApi from "./vcs-api/VcsRemoteApi";
import consumeApi from "./components/modal/consume-api";
import ProjectRemoteApi from "./vcs-api/ProjectRemoteApi";
import Support from "./components/menu/support/Support";
import PublishApiButton from "./components/publish-api-button/PublishApiButton";
import ProjectOptions from "./components/menu/project-options/ProjectOptions";
import {Header} from './components/header'

const repositoryContainer: RepositoryContainer = {
  repository: undefined,
  isLoaded: false
}

const repositoryMock = new FileProvider(repositoryContainer)
const worker = new WebWorker(repositoryMock)

const reducers = {
  [repository.NAME]: repository.reducer,
  [editor.NAME]: editor.reducer,
  [fileSystemTree.NAME]: fileSystemTree.reducer,
  [publishApi.constants.NAME]: publishApi.reducer,
  [consumeApi.name]: consumeApi.reducer,
  dialogs: combineReducers({
    newFolder: newFolder.reducer,
    newFile: newFile.reducer,
    import: importModal.reducer,
    export: exportModal.reducer,
    rename: rename.reducer
  }),
  mock: mockReducer,
  configuration: header.reducer
}

const fileSystemInit = (dataProvider: ?XApiDataProvider ) => {
  try {
    if (repositoryContainer.isLoaded && repositoryContainer.repository._fileSystem._vcsApi.dataProvider.projectId === dataProvider.projectId) {
      return
    }
  } catch (e) {
    console.error('fileSystemInit nice code', e)
  }

  const fileSystem = dataProvider ?
    new VcsFileSystem(new VcsRemoteApi(dataProvider)):
    new LocalStorageFileSystem()

  // Load Repository
  return Repository.fromFileSystem(fileSystem)
    .then((repository) => {
      repositoryContainer.repository = repository
      repositoryContainer.isLoaded = true
      return repository
    })
    .then((repository) => {
      return initFileSystem(FileTreeFactory.repository(repository))
    })
}

const isStandaloneApiDesigner = function () {
  return document.getElementById('designer-root')
}

if (isStandaloneApiDesigner()) {
  let thunkMiddleware = thunk.withExtraArgument({
    worker,
    repositoryContainer
  })

  const middleware = [thunkMiddleware]
  if (location.search.indexOf('redux-logger=true') > -1) {
    middleware.push(reduxLogger())
  }

  const store = createStore(
    combineReducers(reducers),
    applyMiddleware(...middleware)
  )

  fileSystemInit()

  ReactDOM.render(
    <Provider store={store}>
      <Header/>
      <App/>
    </Provider>,
    document.getElementById('root')
  )
}

var PublishApiModal =  publishApi.PublishApiModalContainer

export {
  App,
  ProjectRemoteApi,
  Support,
  ProjectOptions,
  PublishApiButton,
  PublishApiModal,
  reducers,
  worker,
  repositoryContainer,
  fileSystemInit
}
