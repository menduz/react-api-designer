// @flow

import {NAME} from './index';
import type {State} from './model';
import {ElementModel, DirectoryModel, FileSystemTreeModel} from "./model/FileSystemTreeModel";

export const getAll = (state: any): State => state[NAME]

export const getCurrentElement = (rootState: any): ?ElementModel => {
    const state = getAll(rootState);
    const fileSystem = state.fileSystem;
    if(!fileSystem) return

    const currentPath = state.currentNode && state.currentNode.path;
    if(!currentPath) return

    return fileSystem.getByPath(currentPath)
}

export const getCurrentDirectory = (rootState: any): DirectoryModel => {
    const state = getAll(rootState);
    const fileSystem: ?FileSystemTreeModel = state.fileSystem;
    if(!fileSystem) throw new Error('File System is not loaded yet!')

    const currentElement = getCurrentElement(rootState);
    if(!currentElement) return fileSystem.root

    if (currentElement.isDirectory())
        return ((currentElement: any): DirectoryModel)

    const parent = fileSystem.getByPath(currentElement.path.parent());
    return parent? ((parent: any): DirectoryModel): fileSystem.root

}