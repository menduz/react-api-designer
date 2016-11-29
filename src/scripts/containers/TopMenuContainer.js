"use strict";
var react_redux_1 = require('react-redux');
var TopMenu_1 = require("../components/TopMenu");
var index_1 = require("../actions/index");
var repository_1 = require("../actions/repository");
function mapStateToProps(state) {
    return {};
}
function mapDispatchToProps(dispatch) {
    return {
        onAddFile: function () { dispatch(repository_1.addFile()); },
        onAddDirectory: function () { dispatch({ type: index_1.Actions.ADD_DIRECTORY, name: 'myNewDir' }); },
        onSaveFile: function () { dispatch(index_1.saveFile()); }
    };
}
var TopMenuContainer = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(TopMenu_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TopMenuContainer;
