"use strict";
var react_redux_1 = require('react-redux');
var TreeView_1 = require('@mulesoft/anypoint-components/lib/TreeView');
var index_1 = require("../actions/index");
var nodeFromElement = function (expandedDirs, element) {
    if (element.isDirectory())
        return nodeFromDirectory(expandedDirs, element);
    return nodeFromFile(element);
};
var nodeFromDirectory = function (expandedDirs, directory) {
    return {
        name: directory.name,
        path: directory.path,
        expanded: expandedDirs.get(directory.path.toString(), false),
        children: directory.children.map(function (c) { return nodeFromElement(expandedDirs, c); }).toArray()
    };
};
var nodeFromFile = function (file) {
    return {
        name: file.name,
        path: file.path
    };
};
function mapStateToProps(state) {
    return {
        nodes: state.repository.root.children
            .map(function (c) { return nodeFromElement(state.expandedDirs, c); })
            .toArray()
    };
}
function mapDispatchToProps(dispatch) {
    return {
        onClick: function (node) {
            dispatch({ type: index_1.Actions.SELECT_ELEMENT, path: node.path });
        }
    };
}
var TreeViewContainer = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(TreeView_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TreeViewContainer;
