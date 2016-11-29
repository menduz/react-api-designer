import * as React from "react";
import * as ReactDOM from "react-dom";

import {Provider} from "react-redux";
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';


import ApiDesigner from "./components/ApiDesigner";
import {apiDesignerReducer} from "./reducers/index";
import LocalStorageFileSystem from "./repository/file-system/LocalStorageFileSystem";
import {GlobalState} from "./repository/index";
import {MutableRepository} from './repository/mutable/Repository'
import {init} from "./actions/repository";
import {RepositoryFactory} from "./repository/immutable/RepositoryFactory";


// Init Repository

MutableRepository.Repository.fromFileSystem(new LocalStorageFileSystem())
    .then((r) => {
        GlobalState.repository = r;
        store.dispatch(init(RepositoryFactory.fileRepository(r)));
    });

const store = createStore(apiDesignerReducer, applyMiddleware(thunk));

store.subscribe(() => {
    console.log('// %%%%%%% New State %%%%%%%');
    console.log(store.getState().toString());
});

ReactDOM.render(
    <Provider store={store}>
        <ApiDesigner/>
    </Provider>,
    document.getElementById('example'));

