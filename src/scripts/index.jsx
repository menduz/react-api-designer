"use strict";
var React = require("react");
var ReactDOM = require("react-dom");
var react_redux_1 = require("react-redux");
var redux_1 = require('redux');
var redux_thunk_1 = require('redux-thunk');
var ApiDesigner_1 = require("./components/ApiDesigner");
var index_1 = require("./reducers/index");
var LocalStorageFileSystem_1 = require("./repository/file-system/LocalStorageFileSystem");
var index_2 = require("./repository/index");
var Repository_1 = require('./repository/mutable/Repository');
var repository_1 = require("./actions/repository");
var RepositoryFactory_1 = require("./repository/immutable/RepositoryFactory");
// Init Repository
Repository_1.MutableRepository.Repository.fromFileSystem(new LocalStorageFileSystem_1.default())
    .then(function (r) {
    index_2.GlobalState.repository = r;
    store.dispatch(repository_1.init(RepositoryFactory_1.RepositoryFactory.fileRepository(r)));
});
var store = redux_1.createStore(index_1.apiDesignerReducer, redux_1.applyMiddleware(redux_thunk_1.default));
store.subscribe(function () {
    console.log('// %%%%%%% New State %%%%%%%');
    console.log(store.getState().repository);
    console.log(store.getState().selectedElement);
    console.log(store.getState().files.toString());
    console.log(store.getState().expandedDirs.toString());
});
ReactDOM.render(<react_redux_1.Provider store={store}>
        <ApiDesigner_1.default />
    </react_redux_1.Provider>, document.getElementById('example'));
