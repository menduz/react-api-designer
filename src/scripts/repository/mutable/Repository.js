"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FileSystem_1 = require("../file-system/FileSystem");
var immutable_1 = require('immutable');
var MutableRepository;
(function (MutableRepository) {
    var Repository = (function () {
        function Repository(fileSystem, root) {
            this._fileSystem = fileSystem;
            this._root = root;
        }
        Repository.fromFileSystem = function (fileSystem) {
            return fileSystem.directory(Repository.FileSystemSeparator)
                .then(function (entry) { return new Repository(fileSystem, Repository.ElementFactory.directory(entry)); });
        };
        Object.defineProperty(Repository.prototype, "root", {
            get: function () { return this._root; },
            enumerable: true,
            configurable: true
        });
        Repository.prototype.getByPath = function (path) {
            var pathElements = path.split(Repository.FileSystemSeparator)
                .filter(function (s) { return s.length !== 0; });
            return this.root.getByPath(immutable_1.List(pathElements));
        };
        Repository.prototype.saveFile = function (file) {
            var _this = this;
            return file.getContent()
                .then(function (content) { return _this._fileSystem.save(file.path, content); })
                .then(function () { return file; });
        };
        Repository.prototype.addFile = function (path, name, content) {
            var _this = this;
            var element = this.getByPath(path);
            if (!element.isDirectory())
                return;
            var directory = element;
            var file = Repository.File.File(name, content, directory);
            return file.getContent()
                .then(function (content) { return _this._fileSystem.save(file.path, content); })
                .then(function () { directory.children.push(file); })
                .then(function () { return file; });
        };
        Repository.prototype.addDirectory = function (path, name) {
            var element = this.getByPath(path);
            if (!element.isDirectory())
                return;
            var directory = element;
            var newDirectory = new Repository.Directory(name, [], directory);
            directory.children.push(newDirectory);
            return newDirectory;
        };
        Repository.FileSystemSeparator = '/';
        return Repository;
    }());
    MutableRepository.Repository = Repository;
    var Repository;
    (function (Repository) {
        var ElementFactory = (function () {
            function ElementFactory() {
            }
            ElementFactory.element = function (entry, parent) {
                switch (entry.type) {
                    case FileSystem_1.EntryFolder:
                        return ElementFactory.directory(entry, parent);
                    case FileSystem_1.EntryFile:
                        return ElementFactory.file(entry, parent);
                }
                throw entry.type + " is not a valid entry type.";
            };
            ElementFactory.directory = function (entry, parent) {
                if (entry.type !== FileSystem_1.EntryFolder)
                    throw 'This isn\'t a folder entry';
                var children = entry.children.map(function (entry) { return ElementFactory.element(entry); });
                var directory = new Directory(entry.name, children, parent);
                children.forEach(function (child) { child.parent = directory; });
                return directory;
            };
            ElementFactory.file = function (entry, parent) {
                if (entry.type !== FileSystem_1.EntryFile)
                    throw 'This isn\'t a file entry';
                return File.EmptyFile(entry.name, parent);
            };
            return ElementFactory;
        }());
        Repository.ElementFactory = ElementFactory;
        var Element = (function () {
            function Element(name, parent) {
                this._name = name;
                this._parent = parent;
            }
            Object.defineProperty(Element.prototype, "name", {
                get: function () {
                    return this._name;
                },
                set: function (name) {
                    this._name = name;
                    // if (Element.isValidName(name)) this._name = name;
                    // else throw 'Invalid Name';
                },
                enumerable: true,
                configurable: true
            });
            Element.isValidName = function (name) {
                return !!name && name.length > 0;
            };
            Object.defineProperty(Element.prototype, "parent", {
                get: function () {
                    return this._parent;
                },
                set: function (value) {
                    this._parent = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Element.prototype, "path", {
                get: function () {
                    if (!this._parent)
                        return '';
                    return "" + this._parent.path + Repository.FileSystemSeparator + this._name;
                },
                enumerable: true,
                configurable: true
            });
            return Element;
        }());
        Repository.Element = Element;
        var Directory = (function (_super) {
            __extends(Directory, _super);
            function Directory(name, children, parent) {
                _super.call(this, name, parent);
                this._children = children;
            }
            Directory.prototype.isDirectory = function () {
                return true;
            };
            Object.defineProperty(Directory.prototype, "children", {
                get: function () {
                    return this._children;
                },
                enumerable: true,
                configurable: true
            });
            Directory.prototype.addChild = function (child) {
                this._children.push(child);
                return child;
            };
            Directory.prototype.removeChild = function (child) {
                this._children = this._children
                    .filter(function (c) { return c === child; });
                return child;
            };
            Directory.prototype.getByPath = function (path) {
                if (path.isEmpty())
                    return this;
                var childrenResult = this.children
                    .filter(function (e) { return e.name === path.first(); })
                    .map(function (e) { return e.getByPath(path.shift()); });
                return childrenResult.length > 0 ? childrenResult[0] : undefined;
            };
            return Directory;
        }(Element));
        Repository.Directory = Directory;
        var File = (function (_super) {
            __extends(File, _super);
            function File(name, parent) {
                _super.call(this, name, parent);
                this._state = new File.EmptyState(this);
            }
            File.EmptyFile = function (name, parent) {
                return new File(name, parent);
            };
            File.File = function (name, content, parent) {
                var file = new File(name, parent);
                file.setContent(content);
                return file;
            };
            File.prototype.isDirectory = function () {
                return false;
            };
            File.prototype.getContent = function () {
                var _a = this._state.getContent(), content = _a[0], newState = _a[1];
                this._state = newState;
                return content;
            };
            File.prototype.setContent = function (content) {
                this._state = this._state.setContent(content);
            };
            Object.defineProperty(File.prototype, "dirty", {
                get: function () {
                    var _a = this._state.dirty(), dirty = _a[0], newState = _a[1];
                    this._state = newState;
                    return dirty;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(File.prototype, "state", {
                set: function (value) {
                    this._state = value;
                },
                enumerable: true,
                configurable: true
            });
            File.prototype.getByPath = function (path) {
                return path.isEmpty() ? this : undefined;
            };
            return File;
        }(Element));
        Repository.File = File;
        var File;
        (function (File) {
            var EmptyState = (function () {
                function EmptyState(file) {
                    this._file = file;
                }
                EmptyState.prototype.getContent = function () {
                    var contentPromise = new Promise(function (resolve) {
                        // Loads from repository...
                        setTimeout(function () {
                            resolve("");
                        }, 100);
                    });
                    return [contentPromise, new LoadingState(this._file, contentPromise)];
                };
                EmptyState.prototype.setContent = function (content) {
                    return new DirtyState(content);
                };
                EmptyState.prototype.dirty = function () {
                    return [false, this];
                };
                return EmptyState;
            }());
            File.EmptyState = EmptyState;
            var LoadingState = (function () {
                function LoadingState(file, content) {
                    var _this = this;
                    this._file = file;
                    this._content = content;
                    content.then(function (result) {
                        _this._file.state = new LoadedState(result);
                    });
                }
                LoadingState.prototype.getContent = function () {
                    return [this._content, this];
                };
                LoadingState.prototype.setContent = function (content) {
                    return new DirtyState(content);
                };
                LoadingState.prototype.dirty = function () {
                    return [false, this];
                };
                return LoadingState;
            }());
            var LoadedState = (function () {
                function LoadedState(content) {
                    this._content = content;
                }
                LoadedState.prototype.getContent = function () {
                    return [Promise.resolve(this._content), this];
                };
                LoadedState.prototype.setContent = function (content) {
                    return new DirtyState(content);
                };
                LoadedState.prototype.dirty = function () {
                    return [false, this];
                };
                return LoadedState;
            }());
            var DirtyState = (function () {
                function DirtyState(content) {
                    this._content = content;
                }
                DirtyState.prototype.getContent = function () {
                    return [Promise.resolve(this._content), this];
                };
                DirtyState.prototype.setContent = function (content) {
                    this._content = content;
                    return this;
                };
                DirtyState.prototype.dirty = function () {
                    return [true, this];
                };
                return DirtyState;
            }());
        })(File = Repository.File || (Repository.File = {}));
    })(Repository = MutableRepository.Repository || (MutableRepository.Repository = {}));
})(MutableRepository = exports.MutableRepository || (exports.MutableRepository = {}));
