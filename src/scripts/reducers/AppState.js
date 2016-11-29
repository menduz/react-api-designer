"use strict";
var immutable_1 = require('immutable');
var Repository_1 = require('../repository/immutable/Repository');
var AppState = (function () {
    function AppState(_repository, _selectedElement, _files, _expandedDirs) {
        this._repository = _repository;
        this._selectedElement = _selectedElement;
        this._files = _files;
        this._expandedDirs = _expandedDirs;
    }
    AppState.empty = function () {
        return new AppState(Repository_1.Repository.empty(), undefined, immutable_1.Map(), immutable_1.Map());
    };
    Object.defineProperty(AppState.prototype, "repository", {
        get: function () { return this._repository; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppState.prototype, "selectedElement", {
        get: function () { return this._selectedElement; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppState.prototype, "files", {
        get: function () { return this._files; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppState.prototype, "expandedDirs", {
        get: function () { return this._expandedDirs; },
        enumerable: true,
        configurable: true
    });
    AppState.prototype.withRepository = function (repository) {
        return new AppState(repository, this._selectedElement, this._files, this._expandedDirs);
    };
    AppState.prototype.withSelectedElement = function (element) {
        return new AppState(this._repository, element, this._files, this._expandedDirs);
    };
    AppState.prototype.withFiles = function (files) {
        return new AppState(this._repository, this._selectedElement, files, this._expandedDirs);
    };
    AppState.prototype.withExpandedDirs = function (expandedDirs) {
        return new AppState(this._repository, this._selectedElement, this._files, expandedDirs);
    };
    return AppState;
}());
exports.AppState = AppState;
