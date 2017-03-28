//@flow

import "./index.css"
import {combineReducers} from "redux"
import * as bootstrap from "./bootstrap"
import * as editor from "./components/editor"
import * as repository from "./repository-redux"
import mockReducer from "./components/mock/reducers"
import Worker from "./worker"
import {warnBeforeLeave} from "./bootstrap/util"
import * as unsaved from "./components/modal/unsaved"
import newFolder from "./components/modal/new-folder"
import newFile from "./components/modal/new-file"
import importModal from "./components/modal/import"
import exportModal from "./components/modal/export"
import rename from "./components/modal/rename"
import * as messageModal from "./components/modal/message"
import * as fileSystemTree from "./components/tree"
import FileProvider from "./worker/FileProvider"
import type {RepositoryContainer, AuthSelectors, RemoteApiSelectors, ExtraArgs, GetState} from "./types"
import * as header from "./components/header"
import publishApi from "./components/modal/publish-api"
import * as consumeApi from "./components/modal/consume-api"
import ProjectRemoteApi from "./remote-api/ProjectRemoteApi"
import App from "./components/app/App"
import HeaderOptions from "./components/header/HeaderOptions"
import * as toasts from "./components/toasts"
import * as dependenciesTree from "./components/dependencies-tree";


const reducers = {
  designer: combineReducers({
    [bootstrap.NAME]: bootstrap.reducer,
    [repository.NAME]: repository.reducer,
    [editor.NAME]: editor.reducer,
    [fileSystemTree.NAME]: fileSystemTree.reducer,
    [dependenciesTree.NAME]: dependenciesTree.reducer,
    [publishApi.constants.NAME]: publishApi.reducer,
    [consumeApi.NAME]: consumeApi.reducer,
    [toasts.NAME]: toasts.reducer,
    [messageModal.NAME]: messageModal.reducer,
    dialogs: combineReducers({
      [unsaved.NAME]: unsaved.reducer,
      newFolder: newFolder.reducer,
      newFile: newFile.reducer,
      import: importModal.reducer,
      export: exportModal.reducer,
      rename: rename.reducer
    }),
    mock: mockReducer,
    configuration: header.reducer
  })
}

const repositoryContainer: RepositoryContainer = {
  isLoaded: false
}

const initThunkArg = (authSelector: AuthSelectors): ExtraArgs => {
  if (!window.require) throw new Error('require missing. Forgot to include loader.js?')

  const workerUrl = window.require.getConfig().paths['worker']
  const designerWorker = new Worker(workerUrl, new FileProvider(repositoryContainer))

  const designerRemoteApiSelectors = (getState: GetState): RemoteApiSelectors => ({
    baseUrl: () => window.require.getConfig().paths['remoteApi'],
    authorization: () => authSelector.authorization(getState()),
    ownerId: () => authSelector.ownerId(getState()),
    organizationId: () => authSelector.organizationId(getState()),
    organizationDomain: () => authSelector.organizationDomain(getState()),
    projectId: () => bootstrap.selectors.getProjectId(getState())
  })

  return {
    repositoryContainer,
    designerWorker,
    designerRemoteApiSelectors
  }
}

warnBeforeLeave(repositoryContainer)

const actions = bootstrap.actions
export {
  App,
  HeaderOptions,
  actions,
  reducers,
  initThunkArg,
  ProjectRemoteApi
}

