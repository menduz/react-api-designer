"use strict";
var FileSystem_1 = require("./FileSystem");
var LOCAL_PERSISTENCE_KEY = 'localStorageFilePersistence';
var LocalStorageHelper = (function () {
    function LocalStorageHelper() {
    }
    LocalStorageHelper.forEach = function (fn) {
        for (var key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                // A key is a local storage file system entry if it starts
                //with LOCAL_PERSISTENCE_KEY + '.'
                if (key.indexOf(LOCAL_PERSISTENCE_KEY + '.') === 0) {
                    fn(JSON.parse(localStorage.getItem(key)));
                }
            }
        }
    };
    LocalStorageHelper.has = function (path) {
        var has = false;
        path = path || '/';
        LocalStorageHelper.forEach(function (entry) {
            if (entry.path.toLowerCase() === path.toLowerCase()) {
                has = true;
            }
        });
        return has;
    };
    LocalStorageHelper.set = function (path, content) {
        localStorage.setItem(LOCAL_PERSISTENCE_KEY + '.' + path, JSON.stringify(content));
    };
    LocalStorageHelper.get = function (path) {
        return JSON.parse(localStorage.getItem(LOCAL_PERSISTENCE_KEY + '.' + path));
    };
    LocalStorageHelper.remove = function (path) {
        localStorage.removeItem(LOCAL_PERSISTENCE_KEY + '.' + path);
    };
    return LocalStorageHelper;
}());
var LocalStorageFileSystem = (function () {
    function LocalStorageFileSystem() {
        this.supportsFolders = true;
    }
    LocalStorageFileSystem.prototype.fileNotFoundMessage = function (path) {
        return "file with path=\"" + path + "\" does not exist";
    };
    LocalStorageFileSystem.prototype.addChildren = function (entry, fn) {
        if (entry.type === FileSystem_1.EntryFolder) {
            entry.children = fn(entry.path);
        }
    };
    LocalStorageFileSystem.prototype.findFolder = function (path) {
        var _this = this;
        var entries = [];
        LocalStorageHelper.forEach(function (entry) {
            if (entry.path.toLowerCase() === path.toLowerCase()) {
                _this.addChildren(entry, _this.findFiles.bind(_this));
                entries.push(entry);
            }
        });
        return entries.length > 0 ? entries[0] : null;
    };
    LocalStorageFileSystem.prototype.findFiles = function (path) {
        var _this = this;
        if (path.lastIndexOf('/') !== path.length - 1) {
            path += '/';
        }
        var entries = [];
        LocalStorageHelper.forEach(function (entry) {
            if (entry.path.toLowerCase() !== path.toLowerCase() &&
                _this.extractParentPath(entry.path) + '/' === path) {
                _this.addChildren(entry, _this.findFiles);
                entries.push(entry);
            }
        });
        return entries;
    };
    LocalStorageFileSystem.prototype.validatePath = function (path) {
        if (path.indexOf('/') !== 0) {
            return { valid: false, reason: 'Path should start with "/"' };
        }
        return { valid: true };
    };
    LocalStorageFileSystem.prototype.isValidParent = function (path) {
        var parent = this.extractParentPath(path);
        return !(LocalStorageHelper.has(parent) || parent === '');
    };
    LocalStorageFileSystem.prototype.hasChildren = function (path) {
        var has = false;
        LocalStorageHelper.forEach(function (entry) {
            if (entry.path.indexOf(path + '/') === 0) {
                has = true;
            }
        });
        return has;
    };
    LocalStorageFileSystem.prototype.extractNameFromPath = function (path) {
        var pathInfo = this.validatePath(path);
        if (!pathInfo.valid) {
            throw 'Invalid Path!';
        }
        // When the path is ended in '/'
        if (path.lastIndexOf('/') === path.length - 1) {
            path = path.slice(0, -1);
        }
        return path.slice(path.lastIndexOf('/') + 1);
    };
    LocalStorageFileSystem.prototype.extractParentPath = function (path) {
        var pathInfo = this.validatePath(path);
        if (!pathInfo.valid) {
            throw 'Invalid Path!';
        }
        // When the path is ended in '/'
        if (path.lastIndexOf('/') === path.length - 1) {
            path = path.slice(0, -1);
        }
        return path.slice(0, path.lastIndexOf('/'));
    };
    /**
     * List files found in a given path.
     */
    LocalStorageFileSystem.prototype.directory = function (path) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                var isValidPath = _this.validatePath(path);
                if (!isValidPath.valid) {
                    reject(isValidPath.reason);
                    return; // deferred.promise;
                }
                if (!LocalStorageHelper.has('/')) {
                    LocalStorageHelper.set(path, {
                        path: '/',
                        name: '',
                        type: 'folder',
                        meta: {
                            'created': Math.round(new Date().getTime() / 1000.0)
                        }
                    });
                }
                resolve(_this.findFolder(path));
            }, LocalStorageFileSystem.delay);
        });
    };
    ;
    /**
     * Persist a file to an existing folder.
     */
    LocalStorageFileSystem.prototype.save = function (path, content) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                var name = _this.extractNameFromPath(path);
                var entry = LocalStorageHelper.get(path);
                if (!_this.isValidParent(path)) {
                    reject(new Error('Parent folder does not exists: ' + path));
                    return; // deferred.promise;
                }
                var file;
                if (entry) {
                    if (entry.type === FileSystem_1.EntryFolder) {
                        reject('file has the same name as a folder');
                        return; // deferred.promise;
                    }
                    entry.content = content;
                    entry.meta['lastUpdated'] = Math.round(new Date().getTime() / 1000.0);
                    file = entry;
                }
                else {
                    file = {
                        path: path,
                        name: name,
                        content: content,
                        type: 'file',
                        meta: {
                            'created': Math.round(new Date().getTime() / 1000.0)
                        }
                    };
                }
                LocalStorageHelper.set(path, file);
                resolve();
            }, LocalStorageFileSystem.delay);
        });
    };
    ;
    /**
     * Create the folders contained in a path.
     */
    LocalStorageFileSystem.prototype.createFolder = function (path) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var isValidPath = _this.validatePath(path);
            if (!isValidPath.valid) {
                reject(isValidPath.reason);
                return; // deferred.promise;
            }
            if (LocalStorageHelper.has(path)) {
                reject(new Error('Folder already exists: ' + path));
                return; // deferred.promise;
            }
            var parent = _this.extractParentPath(path);
            if (!LocalStorageHelper.has(parent)) {
                reject(new Error('Parent folder does not exists: ' + path));
                return; // deferred.promise;
            }
            setTimeout(function () {
                LocalStorageHelper.set(path, {
                    path: path,
                    name: _this.extractNameFromPath(path),
                    type: 'folder',
                    meta: {
                        'created': Math.round(new Date().getTime() / 1000.0)
                    }
                });
                resolve();
            }, LocalStorageFileSystem.delay);
        });
    };
    /**
     * Loads the content of a file.
     */
    LocalStorageFileSystem.prototype.load = function (path) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                var entry = LocalStorageHelper.get(path);
                if (entry && entry.type === 'file') {
                    resolve(entry.content);
                }
                else {
                    reject(_this.fileNotFoundMessage(path));
                }
            }, LocalStorageFileSystem.delay);
        });
    };
    /**
     * Removes a file or directory.
     */
    LocalStorageFileSystem.prototype.remove = function (path) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                var entry = LocalStorageHelper.get(path);
                if (entry &&
                    entry.type === FileSystem_1.EntryFolder &&
                    _this.hasChildren(path)) {
                    reject('folder not empty');
                    return; //deferred.promise;
                }
                LocalStorageHelper.remove(path);
                resolve();
            }, LocalStorageFileSystem.delay);
        });
    };
    /**
     * Renames a file or directory
     */
    LocalStorageFileSystem.prototype.rename = function (source, destination) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                var sourceEntry = LocalStorageHelper.get(source);
                if (!sourceEntry) {
                    reject('Source file or folder does not exists.');
                    return; // deferred.promise;
                }
                var destinationEntry = LocalStorageHelper.get(destination);
                if (destinationEntry) {
                    reject('File or folder already exists.');
                    return; // deferred.promise;
                }
                if (!_this.isValidParent(destination)) {
                    reject('Destination folder does not exist.');
                    return; // deferred.promise;
                }
                sourceEntry.path = destination;
                sourceEntry.name = _this.extractNameFromPath(destination);
                LocalStorageHelper.remove(destination);
                LocalStorageHelper.remove(source);
                LocalStorageHelper.set(destination, sourceEntry);
                if (sourceEntry.type === FileSystem_1.EntryFolder) {
                    // if (!isValidPath(destination)) {
                    //   deferred.reject('Destination is not a valid folder');
                    //   return deferred.promise;
                    // }
                    //move all child items
                    LocalStorageHelper.forEach(function (entry) {
                        if (entry.path.toLowerCase() !== source.toLowerCase() &&
                            entry.path.indexOf(source) === 0) {
                            var newPath = destination + entry.path.substring(source.length);
                            LocalStorageHelper.remove(entry.path);
                            entry.path = newPath;
                            LocalStorageHelper.set(newPath, entry);
                        }
                    });
                }
                resolve();
            }, LocalStorageFileSystem.delay);
        });
    };
    /**
     *
     * Save in localStorage entries.
     *
     * File structure are objects that contain the following attributes:
     * * path: The full path (including the filename).
     * * content: The content of the file (only valid for files).
     * * isFolder: A flag that indicates whether is a folder or file.
     */
    LocalStorageFileSystem.delay = 500;
    return LocalStorageFileSystem;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LocalStorageFileSystem;
