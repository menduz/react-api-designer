// @flow

import FileSystem, {EntryFolder} from './FileSystem';
import type {Path, Entry} from './FileSystem'

const LOCAL_PERSISTENCE_KEY = 'localStorageFilePersistence';

type LocalStorageEntry = {
    name: string;
    path: string;
    type: 'folder' | 'file';
    meta: ?{[key: string]: any};
    children: ?LocalStorageEntry[];
    content: ?string;
}

const localStorageEntry = (name: string, path: string, type: 'folder' | 'file',
                           meta: ?{[key: string]: any}, children: ?LocalStorageEntry[], content: ?string) => ({
    name, path, type, meta, children, content
})

const toEntry = (entry: LocalStorageEntry) => {
    const children = entry.children && entry.children.map(toEntry)

    return {
        name: entry.name,
        path: entry.path,
        type: entry.type,
        meta: entry.meta,
        children
    }
}

class LocalStorageHelper {
    static forEach(fn: (entry: LocalStorageEntry) => void) {
        for (let key: string in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                // A key is a local storage file system entry if it starts
                //with LOCAL_PERSISTENCE_KEY + '.'
                if (key.indexOf(LOCAL_PERSISTENCE_KEY + '.') === 0) {
                    let item = localStorage.getItem(key);
                    if (item) fn(JSON.parse(item));
                }
            }
        }
    }

    static has(path: Path) {
        let has = false;
        path = path || '/';
        LocalStorageHelper.forEach((entry) => {
            if (entry.path.toLowerCase() === path.toLowerCase()) {
                has = true;
            }
        });
        return has;
    }

    static set(path: Path, content: LocalStorageEntry) {
        localStorage.setItem(
            LOCAL_PERSISTENCE_KEY + '.' + path,
            JSON.stringify(content)
        );
    }

    static get(path: Path): ?LocalStorageEntry {
        let item = localStorage.getItem(LOCAL_PERSISTENCE_KEY + '.' + path);
        if (item) return (JSON.parse(item): LocalStorageEntry);
    }


    static remove(path: Path) {
        localStorage.removeItem(LOCAL_PERSISTENCE_KEY + '.' + path);
    }
}

class LocalStorageFileSystem extends FileSystem {

    _fileNotFoundMessage(path: Path): string {
        return `file with path="${path}" does not exist`;
    }

    _addChildren(entry: LocalStorageEntry, fn: (path: Path) => LocalStorageEntry[]): void {
        if (entry.type === EntryFolder) {
            entry.children = fn(entry.path);
        }
    }

    _findFolder(path: Path): ?LocalStorageEntry {
        let entries: LocalStorageEntry[] = [];
        LocalStorageHelper.forEach((entry) => {
            if (entry.path.toLowerCase() === path.toLowerCase()) {
                this._addChildren(entry, this._findFiles.bind(this));
                entries.push(entry);
            }
        });
        return entries.length > 0 ? entries[0] : null;
    }

    _findFiles(path: Path): LocalStorageEntry[] {
        if (path.lastIndexOf('/') !== path.length - 1) {
            path += '/';
        }

        let entries: LocalStorageEntry[] = [];
        LocalStorageHelper.forEach((entry) => {
            if (entry.path.toLowerCase() !== path.toLowerCase() &&
                this._extractParentPath(entry.path) + '/' === path) {
                this._addChildren(entry, this._findFiles.bind(this));
                entries.push(entry);
            }
        });
        return entries;
    }

    /**
     *
     * Save in localStorage entries.
     *
     * dirty structure are objects that contain the following attributes:
     * * path: The full path (including the filename).
     * * content: The content of the file (only valid for files).
     * * isFolder: A flag that indicates whether is a folder or file.
     */
    static delay = 500;

    supportsFolders = true;

    _validatePath(path: Path): ValidationResult {
        if (path.indexOf('/') !== 0) {
            return {valid: false, reason: 'Path should start with "/"'};
        }
        return {valid: true};
    }

    _isValidParent(path: Path): boolean {
        let parent = this._extractParentPath(path);
        return LocalStorageHelper.has(parent) || parent === '';
    }

    _hasChildren(path: Path): boolean {
        let has = false;
        LocalStorageHelper.forEach((entry) => {
            if (entry.path.indexOf(path + '/') === 0) {
                has = true;
            }
        });
        return has;
    }

    _extractNameFromPath(path: Path): string {
        let pathInfo = this._validatePath(path);

        if (!pathInfo.valid) {
            throw new Error('Invalid Path!');
        }

        // When the path is ended in '/'
        if (path.lastIndexOf('/') === path.length - 1) {
            path = path.slice(0, -1);
        }

        return path.slice(path.lastIndexOf('/') + 1);
    }

    _extractParentPath(path: Path): Path {
        let pathInfo = this._validatePath(path);

        if (!pathInfo.valid) {
            throw new Error('Invalid Path!');
        }

        // When the path is ended in '/'
        if (path.lastIndexOf('/') === path.length - 1) {
            path = path.slice(0, -1);
        }

        return path.slice(0, path.lastIndexOf('/'));
    }

    /**
     * List files found in a given path.
     */
    directory(path: Path): Promise<Entry> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let isValidPath: ValidationResult = this._validatePath(path);

                if (!isValidPath.valid) {
                    reject(isValidPath.reason);
                    return; // deferred.promise;
                }

                if (!LocalStorageHelper.has('/')) {
                    LocalStorageHelper.set(path, localStorageEntry(
                        '',
                        '/',
                        'folder',
                        {
                            'created': Math.round(new Date().getTime() / 1000.0)
                        },
                        undefined,
                        undefined
                        ));
                }

                let folder = this._findFolder(path);
                folder ? resolve(toEntry(folder)) : reject()

            }, LocalStorageFileSystem.delay);
        })
    };

    /**
     * Persist a file to an existing folder.
     */
    save(path: Path, content: string): Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let name: string = this._extractNameFromPath(path);
                let entry: ?LocalStorageEntry = LocalStorageHelper.get(path);

                if (!this._isValidParent(path)) {
                    reject(new Error(`Parent folder does not exists: ${path}`));
                    return; // deferred.promise;
                }

                let file: LocalStorageEntry;
                if (entry) {
                    if (entry.type === EntryFolder) {
                        reject('file has the same name as a folder');
                        return; // deferred.promise;
                    }
                    entry.content = content;

                    let meta = entry.meta;
                    if(meta)
                        meta['lastUpdated'] = Math.round(new Date().getTime() / 1000.0);

                    file = entry;
                } else {
                    file = localStorageEntry(
                        name,
                        path,
                        'file',
                        {
                            'created': Math.round(new Date().getTime() / 1000.0)
                        },
                        undefined,
                        content
                    );
                }

                LocalStorageHelper.set(path, file);
                resolve();

            }, LocalStorageFileSystem.delay);
        })
    };

    /**
     * Create the folders contained in a path.
     */
    createFolder(path: Path): Promise<any> {
        return new Promise((resolve, reject) => {
            let isValidPath: ValidationResult = this._validatePath(path);

            if (!isValidPath.valid) {
                reject(isValidPath.reason);
                return; // deferred.promise;
            }

            if (LocalStorageHelper.has(path)) {
                reject(new Error('Folder already exists: ' + path));
                return; // deferred.promise;
            }

            let parent: string = this._extractParentPath(path);
            if (!LocalStorageHelper.has(parent)) {
                reject(new Error('Parent folder does not exists: ' + path));
                return; // deferred.promise;
            }

            setTimeout(() => {
                LocalStorageHelper.set(path, localStorageEntry(
                    this._extractNameFromPath(path),
                    path,
                    'folder',
                    {
                        'created': Math.round(new Date().getTime() / 1000.0)
                    },
                    undefined,
                    undefined
                ));

                resolve();
            }, LocalStorageFileSystem.delay);
        })
    }

    /**
     * Loads the content of a file.
     */
    load(path: Path): Promise<string> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let entry: ?LocalStorageEntry = LocalStorageHelper.get(path);
                if (entry && entry.type === 'file' && entry.content) {
                    resolve(entry.content);
                } else {
                    reject(this._fileNotFoundMessage(path));
                }
            }, LocalStorageFileSystem.delay);
        })
    }

    /**
     * Removes a file or directory.
     */
    remove(path: Path): Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let entry: ?LocalStorageEntry = LocalStorageHelper.get(path);

                if (entry &&
                    entry.type === EntryFolder &&
                    this._hasChildren(path)) {
                    reject('folder not empty');
                    return; //deferred.promise;
                }

                LocalStorageHelper.remove(path);
                resolve();
            }, LocalStorageFileSystem.delay);
        })
    }

    /**
     * Renames a file or directory
     */
    rename(source: Path, destination: Path): Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let sourceEntry: ?LocalStorageEntry = LocalStorageHelper.get(source);

                if (!sourceEntry) {
                    reject('Source file or folder does not exists.');
                    return; // deferred.promise;
                }

                let destinationEntry: ?LocalStorageEntry = LocalStorageHelper.get(destination);
                if (destinationEntry) {
                    reject('dirty or folder already exists.');
                    return; // deferred.promise;
                }

                if (!this._isValidParent(destination)) {
                    reject('Destination folder does not exist.');
                    return; // deferred.promise;
                }

                sourceEntry.path = destination;
                sourceEntry.name = this._extractNameFromPath(destination);

                LocalStorageHelper.remove(destination);
                LocalStorageHelper.remove(source);
                LocalStorageHelper.set(destination, sourceEntry);

                if (sourceEntry.type === EntryFolder) {
                    // if (!isValidPath(destination)) {
                    //   deferred.reject('Destination is not a valid folder');
                    //   return deferred.promise;
                    // }
                    //move all child items
                    LocalStorageHelper.forEach((entry) => {
                        if (entry.path.toLowerCase() !== source.toLowerCase() &&
                            entry.path.indexOf(source) === 0) {
                            let newPath = destination + entry.path.substring(source.length);
                            LocalStorageHelper.remove(entry.path);
                            entry.path = newPath;
                            LocalStorageHelper.set(newPath, entry);
                        }
                    });
                }

                resolve();
            }, LocalStorageFileSystem.delay);
        })
    }

    // exportFiles() {
    //     let jszip = new $window.JSZip();
    //     LocalStorageHelper.forEach((item) => {
    //         // Skip root folder
    //         if (item.path === '/') {
    //             return;
    //         }
    //
    //         // Skip meta files
    //         if (item.name.slice(-5) === '.meta') {
    //             return;
    //         }
    //
    //         let path = item.path.slice(1); // Remove starting slash
    //         item.type === 'folder' ? jszip.folder(path) : jszip.file(path, item.content);
    //     });
    //
    //     let fileName = $prompt('Please enter a ZIP file name:', 'api.zip');
    //     fileName && $window.saveAs(jszip.generate({type: 'blob'}), fileName);
    // }

}

interface ValidationResult {
    valid: boolean;
    reason?: string;
}

export default LocalStorageFileSystem;