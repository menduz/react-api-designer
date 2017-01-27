// @flow

import {PREFIX} from './constants'
import {FileModel, DirectoryModel, RepositoryModel} from '../repository/immutable/RepositoryModel'
import Factory from '../repository/immutable/RepositoryModelFactory'

import Repository from '../repository/Repository'

import {Path} from '../repository'
import {isValidDirectory, isValidFile} from './selectors'

import type {Dispatch, GetState, ExtraArgs} from '../types/types'

export const INIT_FILE_SYSTEM = `DESIGNER/${PREFIX}/INIT_FILE_SYSTEM`

export const FILE_ADDED = `DESIGNER/${PREFIX}/FILE_ADDED`
export const FILE_ADD_FAILED = `DESIGNER/${PREFIX}/FILE_ADD_FAILED`

export const FILE_SAVE_STARTED = `DESIGNER/${PREFIX}/FILE_SAVE_STARTED`
export const FILE_SAVED = `DESIGNER/${PREFIX}/FILE_SAVED`
export const FILE_SAVE_FAILED = `DESIGNER/${PREFIX}/FILE_SAVE_FAILED`

export const DIRECTORY_ADD_STARTED = `DESIGNER/${PREFIX}/DIRECTORY_ADD_STARTED`
export const DIRECTORY_ADDED = `DESIGNER/${PREFIX}/DIRECTORY_ADDED`
export const DIRECTORY_ADD_FAILED = `DESIGNER/${PREFIX}/DIRECTORY_ADD_FAILED`

export const FILE_CONTENT_UPDATED = `DESIGNER/${PREFIX}/FILE_CONTENT_UPDATED`
export const FILE_CONTENT_UPDATE_FAILED = `DESIGNER/${PREFIX}/FILE_CONTENT_UPDATE_FAILED`

export const initFileSystem = (fileTree: RepositoryModel) => ({
    type: INIT_FILE_SYSTEM,
    payload: fileTree
})

export const fileAdded = (file: FileModel) => ({
    type: FILE_ADDED,
    payload: file
})

export const fileSaved = (file: FileModel) => ({
    type: FILE_SAVED,
    payload: file
})


export const fileContentUpdated = (file: FileModel, content: string) => ({
    type: FILE_CONTENT_UPDATED,
    payload: {file, content}
})

export const directoryAdded = (directory: DirectoryModel) => ({
    type: DIRECTORY_ADDED,
    payload: directory
})

export const error = (type: string, errorMessage: string) => ({
    type,
    payload: errorMessage
})

const defaultContent = (fileType?: string) => {
    switch (fileType) {
        case 'RAML10':
            return '#%RAML 1.0\ntitle: myApi'
        case 'RAML08':
            return '#%RAML 0.8\ntitle: myApi'
      case 'TRAIT':
        return '#%RAML 1.0 Trait'
      case 'RESOURCE-TYPE':
        return '#%RAML 1.0 ResourceType'
      case 'LIBRARY':
        return '#%RAML 1.0 Library\nusage:'
      case 'OVERLAY':
        return '#%RAML 1.0 Overlay\nextends:'
      case 'EXTENSION':
        return '#%RAML 1.0 Extension\nextends:'
      case 'DATA-TYPE':
        return '#%RAML 1.0 DataType'
      case 'DOCUMENTATION-ITEM':
        return '#%RAML 1.0 DocumentationItem\ntitle:\ncontent:'
      case 'NAMED-EXAMPLE':
        return '#%RAML 1.0 NamedExample\nvalue:'
      case 'ANNOTATION-TYPE-DECLARATION':
        return '#%RAML 1.0 AnnotationTypeDeclaration'
      case 'SECURITY-SCHEME':
        return '#%RAML 1.0 SecurityScheme\ntype:'
        default:
            return ''
    }
}

const REPOSITORY_NOT_LOADED = 'Repository not loaded!'

export const addFile = (parentPath: Path, name: string, fileType?: string)  =>
    (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs): any => {
        if (!repositoryContainer.isLoaded)
            return dispatch(error(FILE_ADD_FAILED, REPOSITORY_NOT_LOADED))
        if (!isValidDirectory(parentPath))
            return dispatch(error(FILE_ADD_FAILED, `${parentPath.toString()} is not valid directory`))

        const repository: Repository = repositoryContainer.repository
        const file = repository.addFile(parentPath, name, defaultContent(fileType))
        return dispatch(fileAdded(Factory.fileModel(file)))
    }

export const addDirectory = (parentPath: Path, name: string) =>
    (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs): Promise<any> => {
        if (!repositoryContainer.isLoaded)
            return Promise.reject(dispatch(error(DIRECTORY_ADD_FAILED, REPOSITORY_NOT_LOADED)))
        if (!isValidDirectory(parentPath))
            return Promise.reject(dispatch(error(DIRECTORY_ADD_FAILED, `${parentPath.toString()} is not valid directory`)))

        dispatch({type: DIRECTORY_ADD_STARTED})
        const repository: Repository = repositoryContainer.repository
        return repository.addDirectory(parentPath, name)
            .then(
                (directory) => { dispatch(directoryAdded(Factory.directoryModel(directory))) },
                () => { dispatch(error(DIRECTORY_ADD_FAILED, 'Error on create directory')) }
                )
    }

export const saveFile = (path: Path) =>
    (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs): Promise<any> => {
        if (!repositoryContainer.isLoaded)
            return Promise.reject(dispatch(error(FILE_SAVE_FAILED, REPOSITORY_NOT_LOADED)))
        if (!isValidFile(path))
            return Promise.reject(dispatch(error(FILE_SAVE_FAILED, `${path.toString()} is not valid file`)))

        const repository: Repository = repositoryContainer.repository
        dispatch({type: FILE_SAVE_STARTED})
        return repository.saveFile(path)
            .then(
                (file) => dispatch(fileSaved(Factory.fileModel(file))),
                () => { dispatch(error(FILE_SAVE_FAILED, 'Error on save')) }
            )
    }

export const updateFileContent = (path: Path, content: string) =>
    (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs): any => {
        if (!repositoryContainer.isLoaded)
            return dispatch(error(FILE_CONTENT_UPDATE_FAILED, REPOSITORY_NOT_LOADED))
        if (!isValidFile(path))
            return dispatch(error(FILE_CONTENT_UPDATE_FAILED, `${path.toString()} is not valid file`))

        const repository: Repository = repositoryContainer.repository
        const file = repository.setContent(path, content)
        return dispatch(fileContentUpdated(Factory.fileModel(file), content))
    }