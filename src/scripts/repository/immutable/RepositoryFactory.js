"use strict";
var Repository_1 = require("./Repository");
var Path_1 = require('./../Path');
var immutable_1 = require('immutable');
var RepositoryFactory = (function () {
    function RepositoryFactory() {
    }
    RepositoryFactory.fileRepository = function (mutableRepository) {
        return new Repository_1.Repository(RepositoryFactory.directory(mutableRepository.root));
    };
    RepositoryFactory.directory = function (mutableDirectory) {
        var children = immutable_1.List.of.apply(immutable_1.List, mutableDirectory.children)
            .map(function (element) { return RepositoryFactory.element(element); })
            .toList();
        return Repository_1.Repository.Directory.directory(mutableDirectory.name, Path_1.Path.fromString(mutableDirectory.path), children);
    };
    RepositoryFactory.file = function (file) {
        return new Repository_1.Repository.File(file.name, Path_1.Path.fromString(file.path), file.dirty);
    };
    RepositoryFactory.element = function (element) {
        if (element.isDirectory())
            return RepositoryFactory.directory(element);
        return RepositoryFactory.file(element);
    };
    return RepositoryFactory;
}());
exports.RepositoryFactory = RepositoryFactory;
