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
import mockReducer from './components/mock/reducers'
import WebWorker from './webworker'
import newFolder from './components/modal/new-folder'
import newFile from './components/modal/new-file'
import {initFileSystem} from "./file-system-tree/actions"
import FileSystemTreeModelFactory from "./file-system-tree/model/FileSystemTreeModelFatory"
import * as fileSystemTree from "./file-system-tree"


class RepositoryMock {

    constructor(repositoryContainer) {
        this.repositoryContainer = repositoryContainer
    }

    getFile(path) {
        const byPathString = this.repositoryContainer.repository.getByPathString(path);
        if (byPathString !== undefined) {
            return byPathString.getContent()
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
    [editor.NAME]: editor.reducer,
    [fileSystemTree.NAME]: fileSystemTree.reducer,
    dialogs: combineReducers({
        newFolder: newFolder.reducer,
        newFile: newFile.reducer
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
        store.dispatch(initFileSystem(FileSystemTreeModelFactory.fileSystemTreeModel(repository)))
    })

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)
