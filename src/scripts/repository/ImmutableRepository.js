"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Immutable = require('immutable');
var List = Immutable.List;
var Repository_1 = require('./mutable/Repository');
var ImmutableRepository;
(function (ImmutableRepository) {
    var Repository = (function () {
        function Repository(root, pathSeparator) {
            this._root = root;
            this._pathSeparator = pathSeparator;
        }
        Object.defineProperty(Repository.prototype, "root", {
            get: function () { return this._root; },
            enumerable: true,
            configurable: true
        });
        Repository.fromMutableFileRepository = function (repository) {
            return ImmutableConverter.fileRepository(repository);
        };
        Repository.empty = function () {
            return new Repository(new Repository.Directory('', '/', List()), Repository_1.MutableRepository.Repository.FileSystemSeparator);
        };
        Repository.prototype.getByPath = function (path) {
            var pathElements = path.split(this._pathSeparator)
                .filter(function (s) { return s.length !== 0; });
            return this._root.getByPath(List(pathElements));
        };
        return Repository;
    }());
    ImmutableRepository.Repository = Repository;
    var ImmutableConverter = (function () {
        function ImmutableConverter() {
        }
        ImmutableConverter.fileRepository = function (mutableRepository) {
            return new Repository(ImmutableConverter.directory(mutableRepository.root), Repository_1.MutableRepository.Repository.FileSystemSeparator);
        };
        ImmutableConverter.directory = function (mutableDirectory) {
            var children = List.of.apply(List, mutableDirectory.children)
                .map(function (element) { return ImmutableConverter.element(element); })
                .toList();
            return new Repository.Directory(mutableDirectory.name, mutableDirectory.path, children);
        };
        ImmutableConverter.element = function (element) {
            if (element.isDirectory())
                return ImmutableConverter.directory(element);
            return ImmutableConverter.file(element);
        };
        ImmutableConverter.file = function (file) {
            return new Repository.File(file.name, file.path, file.dirty);
        };
        return ImmutableConverter;
    }());
    var Repository;
    (function (Repository) {
        var Element = (function () {
            function Element(name, path) {
                this._name = name;
                // if (Element.isValidName(name)) this._name = name;
                // else throw 'Invalid Name';
                this._path = path;
            }
            Object.defineProperty(Element.prototype, "name", {
                get: function () { return this._name; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Element.prototype, "path", {
                get: function () { return this._path; },
                enumerable: true,
                configurable: true
            });
            Element.isValidName = function (name) {
                return !!name && name.length > 0;
            };
            return Element;
        }());
        Repository.Element = Element;
        var Directory = (function (_super) {
            __extends(Directory, _super);
            function Directory(name, path, children) {
                _super.call(this, name, path);
                this._children = children;
            }
            Directory.prototype.isDirectory = function () { return true; };
            Object.defineProperty(Directory.prototype, "children", {
                get: function () { return this._children; },
                enumerable: true,
                configurable: true
            });
            Directory.prototype.getByPath = function (pathElements) {
                if (pathElements.isEmpty())
                    return this;
                return this.children
                    .filter(function (e) { return e.name === pathElements.first(); })
                    .take(1)
                    .map(function (e) { return e.getByPath(pathElements.shift()); })
                    .first();
            };
            return Directory;
        }(Element));
        Repository.Directory = Directory;
        var File = (function (_super) {
            __extends(File, _super);
            function File(_name, _path, _dirty) {
                _super.call(this, _name, _path);
                this._dirty = _dirty;
            }
            File.prototype.isDirectory = function () { return false; };
            Object.defineProperty(File.prototype, "name", {
                get: function () { return this._name; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(File.prototype, "path", {
                get: function () { return this._path; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(File.prototype, "dirty", {
                get: function () { return this._dirty; },
                enumerable: true,
                configurable: true
            });
            File.prototype.getByPath = function (pathElements) {
                if (pathElements.isEmpty())
                    return this;
                return undefined;
            };
            return File;
        }(Element));
        Repository.File = File;
    })(Repository = ImmutableRepository.Repository || (ImmutableRepository.Repository = {}));
})(ImmutableRepository = exports.ImmutableRepository || (exports.ImmutableRepository = {}));
