// @flow

import FileSystem from './file-system/FileSystem'
import type {Entry} from './file-system/FileSystem'
import Path from './Path'
import File from './File';
import Element from './Element';
import Directory from './Directory';
import ElementFactory from './ElementFactory';

export default class Repository {
    static FileSystemSeparator = '/'

    _fileSystem: FileSystem
    _root: Directory

    constructor(fileSystem: FileSystem, root: Directory) {
        this._fileSystem = fileSystem
        this._root = root
    }

    static fromFileSystem(fileSystem: FileSystem): Promise<Repository> {
        return fileSystem.directory(Repository.FileSystemSeparator)
            .then((e: Entry) => new Repository(fileSystem, ElementFactory.directory(fileSystem, e)))
    }

    get root(): Directory {
        return this._root
    }

    getByPathString(path: string): ?Element {
        return this.getByPath(Path.fromString(path))
    }

    getByPath(path: Path): ?Element {
        return this._root.getByPath(path)
    }

    saveFile(file: File): Promise<File> {
        return file.getContent()
            .then((content) => this._fileSystem.save(file.path, content))
            .then(() => file)
    }

    addFile(path: Path, name: string, content: string): Promise<File> {
        const element = this.getByPath(path)
        if (!element || !element.isDirectory()) return Promise.reject()

        const directory = ((element: any): Directory)
        const file = File.dirty(name, content, directory)

        return file.getContent()
            .then(content => this._fileSystem.save(file.path, content))
            .then(() => { directory.children.push(file) })
            .then(() => file)
    }

    addDirectory(path: Path, name: string): Promise<Directory> {
        const element = this.getByPath(path)
        if (!element || !element.isDirectory()) return Promise.reject()

        const directory: Directory = ((element: any): Directory)
        const newDirectory = new Directory(name, [], directory)

        return this._fileSystem.createFolder(newDirectory.path)
            .then(() => { directory.children.push(newDirectory) })
            .then(() => newDirectory)
    }
}