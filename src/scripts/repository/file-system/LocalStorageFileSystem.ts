import {FileSystem, EntryFolder, Entry, Path} from "./FileSystem";
const LOCAL_PERSISTENCE_KEY = 'localStorageFilePersistence';

abstract class LocalStorageHelper {
    static forEach(fn: (entry: LocalStorageEntry) => void) {
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                // A key is a local storage file system entry if it starts
                //with LOCAL_PERSISTENCE_KEY + '.'
                if (key.indexOf(LOCAL_PERSISTENCE_KEY + '.') === 0) {
                    fn(JSON.parse(localStorage.getItem(key)));
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
    static get(path: Path) {
        return JSON.parse(localStorage.getItem(LOCAL_PERSISTENCE_KEY + '.' + path));
    }
    static remove (path: Path) {
        localStorage.removeItem(LOCAL_PERSISTENCE_KEY + '.' + path);
    }
}

class LocalStorageFileSystem implements FileSystem {

    private fileNotFoundMessage(path: Path): string {
        return `file with path="${path}" does not exist`;
    }

    private addChildren(entry: LocalStorageEntry, fn: (path: Path) => LocalStorageEntry[]): void {
        if (entry.type === EntryFolder) {
            entry.children = fn(entry.path);
        }
    }

    private findFolder(path: Path): LocalStorageEntry {
        let entries: LocalStorageEntry[] = [];
        LocalStorageHelper.forEach((entry) => {
            if (entry.path.toLowerCase() === path.toLowerCase()) {
                this.addChildren(entry, this.findFiles.bind(this));
                entries.push(entry);
            }
        });
        return entries.length > 0 ? entries[0] : null;
    }

    private findFiles(path: Path): LocalStorageEntry[] {
        if (path.lastIndexOf('/') !== path.length - 1) {
            path += '/';
        }

        let entries: LocalStorageEntry[] = [];
        LocalStorageHelper.forEach((entry) => {
            if (entry.path.toLowerCase() !== path.toLowerCase() &&
                this.extractParentPath(entry.path) + '/' === path) {
                this.addChildren(entry, this.findFiles.bind(this));
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

    private validatePath(path: Path): ValidationResult {
        if (path.indexOf('/') !== 0) {
            return {valid: false, reason: 'Path should start with "/"'};
        }
        return {valid: true};
    }

    private isValidParent(path: Path): boolean {
        let parent = this.extractParentPath(path);
        return LocalStorageHelper.has(parent) || parent === '';
    }

    private hasChildren(path: Path): boolean {
        let has = false;
        LocalStorageHelper.forEach((entry) => {
            if (entry.path.indexOf(path + '/') === 0) {
                has = true;
            }
        });
        return has;
    }

    private extractNameFromPath(path: Path): string {
        let pathInfo = this.validatePath(path);

        if (!pathInfo.valid) {
            throw 'Invalid Path!';
        }

        // When the path is ended in '/'
        if (path.lastIndexOf('/') === path.length - 1) {
            path = path.slice(0, -1);
        }

        return path.slice(path.lastIndexOf('/') + 1);
    }

    private extractParentPath(path: Path): Path {
        let pathInfo = this.validatePath(path);

        if (!pathInfo.valid) {
            throw 'Invalid Path!';
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
                let isValidPath: ValidationResult = this.validatePath(path);

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

                resolve(this.findFolder(path));
            }, LocalStorageFileSystem.delay);
        })
    };

    /**
     * Persist a file to an existing folder.
     */
    save(path: Path, content: string): Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let name: string = this.extractNameFromPath(path);
                let entry: LocalStorageEntry = LocalStorageHelper.get(path) as LocalStorageEntry;

                if (!this.isValidParent(path)) {
                    reject(new Error('Parent folder does not exists: ' + path));
                    return; // deferred.promise;
                }

                let file: LocalStorageEntry;
                if (entry) {
                    if (entry.type === EntryFolder) {
                        reject('file has the same name as a folder');
                        return; // deferred.promise;
                    }
                    entry.content = content;
                    entry.meta['lastUpdated'] = Math.round(new Date().getTime() / 1000.0);
                    file = entry;
                } else {
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
        })
    };

    /**
     * Create the folders contained in a path.
     */
    createFolder(path: Path): Promise<any> {
        return new Promise((resolve, reject) => {
            let isValidPath: ValidationResult = this.validatePath(path);

            if (!isValidPath.valid) {
                reject(isValidPath.reason);
                return; // deferred.promise;
            }

            if (LocalStorageHelper.has(path)) {
                reject(new Error('Folder already exists: ' + path));
                return; // deferred.promise;
            }

            let parent: string = this.extractParentPath(path);
            if (!LocalStorageHelper.has(parent)) {
                reject(new Error('Parent folder does not exists: ' + path));
                return; // deferred.promise;
            }

            setTimeout(() => {
                LocalStorageHelper.set(path, {
                    path: path,
                    name: this.extractNameFromPath(path),
                    type: 'folder',
                    meta: {
                        'created': Math.round(new Date().getTime() / 1000.0)
                    }
                });

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
                let entry: LocalStorageEntry = LocalStorageHelper.get(path) as LocalStorageEntry;
                if (entry && entry.type === 'file') {
                    resolve(entry.content);
                } else {
                    reject(this.fileNotFoundMessage(path));
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
                let entry: LocalStorageEntry = LocalStorageHelper.get(path) as LocalStorageEntry;

                if (entry &&
                    entry.type === EntryFolder &&
                    this.hasChildren(path)) {
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
                let sourceEntry: LocalStorageEntry = LocalStorageHelper.get(source) as LocalStorageEntry;

                if (!sourceEntry) {
                    reject('Source file or folder does not exists.');
                    return; // deferred.promise;
                }

                let destinationEntry: LocalStorageEntry = LocalStorageHelper.get(destination) as LocalStorageEntry;
                if (destinationEntry) {
                    reject('dirty or folder already exists.');
                    return; // deferred.promise;
                }

                if (!this.isValidParent(destination)) {
                    reject('Destination folder does not exist.');
                    return; // deferred.promise;
                }

                sourceEntry.path = destination;
                sourceEntry.name = this.extractNameFromPath(destination);

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

interface LocalStorageEntry extends Entry { content?: string; }

interface ValidationResult {
    valid: boolean;
    reason?: string;
}

export default LocalStorageFileSystem;