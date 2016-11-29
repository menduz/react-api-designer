"use strict";
(function (Actions) {
    Actions[Actions["INIT"] = 0] = "INIT";
    Actions[Actions["SELECT_ELEMENT"] = 1] = "SELECT_ELEMENT";
    Actions[Actions["FILE_ADDED"] = 2] = "FILE_ADDED";
    Actions[Actions["ADD_DIRECTORY"] = 3] = "ADD_DIRECTORY";
    Actions[Actions["SAVE_FILE"] = 4] = "SAVE_FILE";
    Actions[Actions["FILE_SAVED"] = 5] = "FILE_SAVED";
})(exports.Actions || (exports.Actions = {}));
var Actions = exports.Actions;
var SelectElement = (function () {
    function SelectElement() {
        this.type = Actions.SELECT_ELEMENT;
    }
    return SelectElement;
}());
exports.SelectElement = SelectElement;
var AddDirectory = (function () {
    function AddDirectory() {
        this.type = Actions.ADD_DIRECTORY;
    }
    return AddDirectory;
}());
exports.AddDirectory = AddDirectory;
exports.saveFile = function () { return { type: Actions.SAVE_FILE, }; };
var SaveFile = (function () {
    function SaveFile() {
        this.type = Actions.SAVE_FILE;
    }
    return SaveFile;
}());
exports.SaveFile = SaveFile;
exports.fileSaved = function (path) {
    return {
        type: Actions.SAVE_FILE,
        path: path
    };
};
var FileSaved = (function () {
    function FileSaved() {
        this.type = Actions.SAVE_FILE;
    }
    return FileSaved;
}());
exports.FileSaved = FileSaved;
