"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var immutable_1 = require('immutable');
var Path = (function () {
    function Path() {
    }
    Path.emptyPath = function (absolute) {
        if (absolute === void 0) { absolute = true; }
        return absolute ? new AbsoluteEmptyPath() : new RelativeEmptyPath();
    };
    Path.path = function (elements, absolute) {
        if (absolute === void 0) { absolute = true; }
        var filteredElements = elements.filter(function (s) { return s && s.length > 0; });
        if (filteredElements.isEmpty())
            return Path.emptyPath(absolute);
        return absolute ? new AbsolutePathImpl(elements) : new RelativePathImpl(elements);
    };
    Path.fromString = function (value) {
        var absolute = value.indexOf(Path.FileSystemSeparator) === 0;
        return Path.path(immutable_1.List(value.split(Path.FileSystemSeparator)));
    };
    Path.FileSystemSeparator = '/';
    return Path;
}());
exports.Path = Path;
var EmptyPath = (function (_super) {
    __extends(EmptyPath, _super);
    function EmptyPath() {
        _super.apply(this, arguments);
    }
    EmptyPath.prototype.isEmpty = function () { return true; };
    EmptyPath.prototype.parent = function () { return this; };
    EmptyPath.prototype.shift = function () { return this; };
    EmptyPath.prototype.first = function () { return ''; };
    EmptyPath.prototype.last = function () { return ''; };
    EmptyPath.prototype.elements = function () { return immutable_1.List(); };
    return EmptyPath;
}(Path));
var AbsoluteEmptyPath = (function (_super) {
    __extends(AbsoluteEmptyPath, _super);
    function AbsoluteEmptyPath() {
        _super.apply(this, arguments);
    }
    AbsoluteEmptyPath.prototype.isAbsolute = function () { return true; };
    AbsoluteEmptyPath.prototype.toString = function () { return Path.FileSystemSeparator; };
    return AbsoluteEmptyPath;
}(EmptyPath));
var RelativeEmptyPath = (function (_super) {
    __extends(RelativeEmptyPath, _super);
    function RelativeEmptyPath() {
        _super.apply(this, arguments);
    }
    RelativeEmptyPath.prototype.isAbsolute = function () { return false; };
    RelativeEmptyPath.prototype.toString = function () { return ''; };
    return RelativeEmptyPath;
}(EmptyPath));
var PathImpl = (function (_super) {
    __extends(PathImpl, _super);
    function PathImpl(elements) {
        _super.call(this);
        this._elements = elements;
    }
    PathImpl.prototype.isEmpty = function () { return false; };
    PathImpl.prototype.parent = function () { return Path.path(this._elements.pop()); };
    PathImpl.prototype.shift = function () { return Path.path(this._elements.shift()); };
    PathImpl.prototype.first = function () { return this._elements.first(); };
    PathImpl.prototype.last = function () { return this._elements.last(); };
    PathImpl.prototype.elements = function () { return this._elements; };
    return PathImpl;
}(Path));
var AbsolutePathImpl = (function (_super) {
    __extends(AbsolutePathImpl, _super);
    function AbsolutePathImpl() {
        _super.apply(this, arguments);
    }
    AbsolutePathImpl.prototype.isAbsolute = function () { return true; };
    AbsolutePathImpl.prototype.toString = function () { return Path.FileSystemSeparator + this._elements.join(Path.FileSystemSeparator); };
    return AbsolutePathImpl;
}(PathImpl));
var RelativePathImpl = (function (_super) {
    __extends(RelativePathImpl, _super);
    function RelativePathImpl() {
        _super.apply(this, arguments);
    }
    RelativePathImpl.prototype.isAbsolute = function () { return false; };
    RelativePathImpl.prototype.toString = function () { return this._elements.join(Path.FileSystemSeparator); };
    return RelativePathImpl;
}(PathImpl));
