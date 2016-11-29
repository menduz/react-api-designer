"use strict";
var index_1 = require("../repository/index");
var index_2 = require('./index');
var RepositoryFactory_1 = require("../repository/immutable/RepositoryFactory");
exports.init = function (repositoy) { return { type: index_2.Actions.INIT, repository: repositoy }; };
var InitAction = (function () {
    function InitAction() {
        this.type = index_2.Actions.INIT;
    }
    return InitAction;
}());
exports.InitAction = InitAction;
exports.addFile = function () {
    return function (dispatch, getState) {
        var appState = getState();
        var parentPath = appState.selectedElement && appState.selectedElement.isDirectory() ?
            appState.selectedElement.path : index_1.GlobalState.repository.root.path;
        index_1.GlobalState.repository.addFile(parentPath.toString(), 'pepe.raml', '#%RAML 1.0')
            .then(function (file) { dispatch(fileAdded(RepositoryFactory_1.RepositoryFactory.file(file))); });
    };
};
var fileAdded = function (file) { return ({ type: index_2.Actions.FILE_ADDED, file: file }); };
var FileAdded = (function () {
    function FileAdded() {
        this.type = index_2.Actions.FILE_ADDED;
    }
    return FileAdded;
}());
exports.FileAdded = FileAdded;
