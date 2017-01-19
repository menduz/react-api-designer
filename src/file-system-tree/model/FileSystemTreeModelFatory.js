// @flow

import {List} from 'immutable'

import Path from '../../repository/Path'
import File from '../../repository/File'
import Element from '../../repository/Element';
import Directory from '../../repository/Directory';
import Repository from '../../repository/Repository';

import {FileModel, DirectoryModel, FileSystemTreeModel, ElementModel} from './FileSystemTreeModel';

export default class FileSystemTreeModelFactory {
    static fileSystemTreeModel(repository: Repository) {
        return new FileSystemTreeModel(FileSystemTreeModelFactory.directoryModel(repository.root))
    }

    static directoryModel(directory: Directory): DirectoryModel {
        const children = List.of(... directory.children)
            .map((element) => FileSystemTreeModelFactory.elementModel(element))
            .toList()

        return DirectoryModel.directory(directory.name,
            Path.fromString(directory.path),
            children)
    }

    static fileModel(file: File): FileModel {
        return new FileModel(file.name, Path.fromString(file.path), file.dirty)
    }

    static elementModel(element: Element): ElementModel {
        if (element.isDirectory()) return FileSystemTreeModelFactory.directoryModel(((element: any): Directory))

        return FileSystemTreeModelFactory.fileModel(((element: any): File))
    }
}