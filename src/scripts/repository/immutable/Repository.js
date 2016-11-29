"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var immutable_1 = require('immutable');
var immutable_2 = require('immutable');
var Path_1 = require('./../Path');
var Repository = (function () {
    function Repository(root) {
        this._root = root;
    }
    Object.defineProperty(Repository.prototype, "root", {
        get: function () { return this._root; },
        enumerable: true,
        configurable: true
    });
    Repository.empty = function () {
        return new Repository(Repository.Directory.directory('', Path_1.Path.emptyPath(), immutable_1.List()));
    };
    Repository.prototype.getByPath = function (path) {
        return this._root.getByPath(path);
    };
    Repository.prototype.renameFile = function (file, name) {
        return this.updateElement(file.withName(name));
    };
    Repository.prototype.moveElement = function (from, to) {
        var element = this.getByPath(from);
        return this
            .removeElement(from)
            .updateElement(element.withPath(to));
    };
    Repository.prototype.updateElement = function (element) {
        return new Repository(this._root.updateElement(element.path.parent(), element));
    };
    Repository.prototype.removeElement = function (path) {
        return new Repository(this._root.removeElement(path.parent(), path.last()));
    };
    return Repository;
}());
exports.Repository = Repository;
var Repository;
(function (Repository) {
    var Element = (function () {
        function Element(name, path) {
            this._name = name;
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
        Directory.directory = function (name, path, children) {
            var childrenMap = immutable_2.Map(children.map(function (c) { return [c.name, c]; }));
            return new Directory(name, path, childrenMap);
        };
        Directory.prototype.isDirectory = function () { return true; };
        Object.defineProperty(Directory.prototype, "children", {
            get: function () { return immutable_1.List(this._children.values()); },
            enumerable: true,
            configurable: true
        });
        Directory.prototype.withChildren = function (children) {
            return new Directory(this.name, this.path, children);
        };
        Directory.prototype.withChild = function (child) {
            return this.withChildren(this._children.set(child.name, child));
        };
        Directory.prototype.withPath = function (path) { return new Directory(this._name, path, this._children); };
        Directory.prototype.getByPath = function (path) {
            if (path.isEmpty())
                return this;
            var child = this._children.get(path.first());
            return child ? child.getByPath(path.shift()) : null;
        };
        Directory.prototype.updateElement = function (parentPath, element) {
            if (parentPath.isEmpty())
                return this.withChild(element);
            var child = this._children.get(parentPath.first());
            if (!child || !child.isDirectory())
                throw "'" + parentPath + "' is not a valid path.";
            var directoryChild = child;
            return this.withChild(directoryChild.updateElement(parentPath.shift(), element));
        };
        Directory.prototype.removeElement = function (parentPath, name) {
            if (parentPath.isEmpty())
                return this.withChildren(this._children.remove(name));
            var child = this._children.get(parentPath.first());
            if (!child || !child.isDirectory())
                throw "'" + parentPath + "' is not a valid directory.";
            var directoryChild = child;
            return this.withChild(directoryChild.removeElement(parentPath.shift(), name));
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
        Object.defineProperty(File.prototype, "dirty", {
            get: function () { return this._dirty; },
            enumerable: true,
            configurable: true
        });
        File.prototype.getByPath = function (path) {
            return path.isEmpty() ? this : null;
        };
        File.prototype.withName = function (name) { return new File(name, this._path, this._dirty); };
        File.prototype.withPath = function (path) { return new File(this._name, path, this._dirty); };
        return File;
    }(Element));
    Repository.File = File;
})(Repository = exports.Repository || (exports.Repository = {}));
