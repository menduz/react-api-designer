"use strict";
var AppState_1 = require("./AppState");
var index_1 = require("../actions/index");
var Path_1 = require("../repository/Path");
var addDirectoryReducer = function (state, addDirectoryAction) {
    // const path = state.selectedElement && state.selectedElement.isDirectory() ? state.selectedElement.path : state.repository.root.path;
    // GlobalState.repository.addDirectory(path, addDirectoryAction.name);
    // return state
    //     .withRepository(fromMutableFileRepository(GlobalState.repository));
    return state;
};
var addFileReducer = function (state, addFileAction) {
    return state.withRepository(state.repository.updateElement(addFileAction.file));
};
var selectElementReducer = function (state, selectAction) {
    var element = state.repository.getByPath(Path_1.Path.fromString(selectAction.path));
    var selectedState = state.withSelectedElement(element);
    var toggleDir = function (expandedDirs, path) {
        var expanded = expandedDirs.get(path, false);
        return expandedDirs.set(path, !expanded);
    };
    return element.isDirectory() ? selectedState.withExpandedDirs(toggleDir(state.expandedDirs, element.path.toString())) : selectedState;
};
var initReducer = function (state, action) { return state.withRepository(action.repository); };
var saveFileReducer = function (state, action) {
    var selectedElement = state.selectedElement;
    if (!selectedElement)
        return state;
};
exports.apiDesignerReducer = function (state, action) {
    state = state || AppState_1.AppState.empty();
    console.log("// ======= Action ======= ");
    console.log(action);
    switch (action.type) {
        case index_1.Actions.INIT:
            return initReducer(state, action);
        case index_1.Actions.SELECT_ELEMENT:
            return selectElementReducer(state, action);
        case index_1.Actions.FILE_ADDED:
            return addFileReducer(state, action);
        case index_1.Actions.ADD_DIRECTORY:
            return addDirectoryReducer(state, action);
        default:
            return state;
    }
};
