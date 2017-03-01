//@flow

import "./index.css";
import {combineReducers} from "redux";
import {actions} from "./bootstrap";
import * as editor from "./components/editor";
import * as repository from "./repository-redux";
import mockReducer from "./components/mock/reducers";
import Worker from "./worker";
import newFolder from "./components/modal/new-folder";
import newFile from "./components/modal/new-file";
import importModal from "./components/modal/import";
import exportModal from "./components/modal/export";
import rename from "./components/modal/rename";
import * as fileSystemTree from "./components/tree";
import FileProvider from "./worker/FileProvider";
import type {RepositoryContainer} from "./types";
import * as header from "./components/header";
import publishApi from "./components/modal/publish-api";
import consumeApi from "./components/modal/consume-api";
import ProjectRemoteApi from "./remote-api/ProjectRemoteApi";
import App from "./components/app/App";
import HeaderOptions from "./components/header/HeaderOptions";

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

const repositoryContainer: RepositoryContainer = {
  repository: undefined,
  isLoaded: false
}

const thunk = {
  worker : new Worker(new FileProvider(repositoryContainer)),
  repositoryContainer
}

export {
  App,
  HeaderOptions,

  reducers,
  thunk,
  actions,
  ProjectRemoteApi
}

