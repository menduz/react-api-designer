// @flow

import {FileSystemTreeModel, FileModel, DirectoryModel, ElementModel} from './model/FileSystemTreeModel';
import {Set} from 'immutable'
import Path from "../repository/Path";

export type State = {
    fileSystem: ?FileSystemTreeModel,
    currentNode: ?Node,
    expandedFiles: Set<string>
}

export type Node = {
    module: string,
    path: Path,
    isDirectory: boolean,
    collapsed: ?boolean,
    children: ?Node[],
    leaf: ?boolean
}

export const fromFileSystem = (fileSystem: FileSystemTreeModel) => (expandedFiles: Set<string>): Node => {
    return fromDirectory(expandedFiles)(fileSystem.root)
}

const fromElement = (expandedFiles: Set<string>) => (element: ElementModel): Node => {
    return element.isDirectory()
        ? fromDirectory(expandedFiles)(((element: any): DirectoryModel))
        : fromFile(((element: any): FileModel))
}

const fromDirectory = (expandedFiles: Set<string>) => (directory: DirectoryModel): Node => {
    const children = directory.children
        .map(fromElement(expandedFiles))
        .toArray();
    return {
        module: directory.name,
        path: directory.path,
        isDirectory: false,
        collapsed: expandedFiles.contains(directory.path.toString()),
        children,
        leaf: false
    }
}

const fromFile = (file: FileModel): Node => {
    return {
        module: file.name,
        path: file.path,
        isDirectory: false,
        collapsed: undefined,
        children: undefined,
        leaf: true
    }
}