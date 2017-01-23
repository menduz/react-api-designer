//@flow

import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/app/App'
import './index.css'
import {createStore, applyMiddleware, combineReducers} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
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
    text: string

    constructor() {
        this.text = ''
    }

    getFile(path) {
        return this.text
    }

    setFile(text) {
        this.text = text
    }
}
const repositoryMock = new RepositoryMock()

const worker = new WebWorker(repositoryMock)

const repositoryContainer = {
    repository: undefined,
    isLoaded: false
}

let thunkMiddleware = thunk.withExtraArgument({
    worker,
    repositoryContainer
})

const middleware = [thunkMiddleware]
if (process.env.NODE_ENV !== 'production') {
    middleware.push(createLogger())
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

let listener = () => {
    if (repositoryMock) {
        const editor = store.getState().editor
        if (editor && editor.text) repositoryMock.setFile(editor.text)
    }
}
store.subscribe(listener)

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
