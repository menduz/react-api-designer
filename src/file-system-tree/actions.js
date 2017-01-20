// @flow

import {PREFIX} from './index'
import {FileModel, DirectoryModel, FileSystemTreeModel} from './model/FileSystemTreeModel'
import Factory from './model/FileSystemTreeModelFatory';

import Repository from '../repository/Repository'

import type {Node} from './model'
import {getCurrentDirectory} from "./selectors";

import * as editor from "../components/editor";
import File from "../repository/File";

export const INIT_FILE_SYSTEM = `DESIGNER/${PREFIX}/INIT_FILE_SYSTEM`

export const FILE_ADDED = `DESIGNER/${PREFIX}/FILE_ADDED`
export const DIRECTORY_ADDED = `DESIGNER/${PREFIX}/DIRECTORY_ADDED`

export const NODE_SELECTED = `DESIGNER/${PREFIX}/NODE_SELECTED`
export const TREE_CHANGED = `DESIGNER/${PREFIX}/TREE_CHANGED`

export const initFileSystem = (fileSystemModel: FileSystemTreeModel) => ({
    type: INIT_FILE_SYSTEM,
    payload: fileSystemModel
})

export const fileAdded = (file: FileModel) => ({
    type: FILE_ADDED,
    payload: file
})

export const directoryAdded = (directory: DirectoryModel) => ({
    type: DIRECTORY_ADDED,
    payload: directory
})

type Action = {type: any}
type Dispatch = (action: Action) => void;
type GetState = () => {[key: string]: any}
type ExtraArgs = {repositoryContainer: {repository: Repository}}

const defaultContent = (fileType: string) => {
    switch (fileType) {
        case 'RAML10':
            return "#%RAML 1.0\ntitle: myApi"
        case 'RAML08':
        default:
            return "#%RAML 0.8\ntitle: myApi"
    }
}

export const addFile = (name: string, fileType: string) =>
    (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs) => {
        if (!repositoryContainer.isLoaded) return
        const repository: Repository = repositoryContainer.repository
        const parent = getCurrentDirectory(getState());

        repository.addFile(parent.path, name, defaultContent(fileType))
            .then((file) => {
                dispatch(fileAdded(Factory.fileModel(file)))
            })
    }

export const addDirectory = (name: string) =>
    (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs) => {
        if (!repositoryContainer.isLoaded) return
        const repository: Repository = repositoryContainer.repository
        const parent = getCurrentDirectory(getState());

        repository.addDirectory(parent.path, name)
            .then((directory) => {
                dispatch(directoryAdded(Factory.directoryModel(directory)))
            })
    }

export const treeChanged = (tree: Node) => ({
    type: TREE_CHANGED,
    payload: tree
})

export const nodeSelected = (node: Node) =>
    (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs) => {
        dispatch({
            type: NODE_SELECTED,
            payload: node
        })


        if (!repositoryContainer.isLoaded) return
        const repository: Repository = repositoryContainer.repository
        const element = repository.getByPath(node.path);
        if(!element || element.isDirectory()) return

        const path = editor.selectors.getCurrentFilePath(getState());
        if (path === node.path.toString()) return

        const file: File = ((element: any): File);
        file.getContent()
            .then((content) => {
                dispatch(editor.actions.updateFile(content, node.path.toString()))
            })
    }