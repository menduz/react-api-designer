// @flow

import {PREFIX} from './constants'
import {FileModel, DirectoryModel, RepositoryModel, ElementModel} from '../repository/immutable/RepositoryModel'
import Factory from '../repository/immutable/RepositoryModelFactory'

import Repository from '../repository/Repository'

import {Path} from '../repository'
import {isValidDirectory, isValidFile, getFileTree} from './selectors'
import {clean} from '../components/editor/actions'

import type {Dispatch, GetState, ExtraArgs} from '../types/types'

export const INIT_FILE_SYSTEM = `DESIGNER/${PREFIX}/INIT_FILE_SYSTEM`

export const FILE_ADDED = `DESIGNER/${PREFIX}/FILE_ADDED`
export const FILE_ADD_FAILED = `DESIGNER/${PREFIX}/FILE_ADD_FAILED`

export const FILE_SAVE_STARTED = `DESIGNER/${PREFIX}/FILE_SAVE_STARTED`
export const FILE_SAVED = `DESIGNER/${PREFIX}/FILE_SAVED`
export const FILE_SAVE_FAILED = `DESIGNER/${PREFIX}/FILE_SAVE_FAILED`

export const FILE_DELETE_STARTED = `DESIGNER/${PREFIX}/FILE_DELETE_STARTED`
export const FILE_DELETED = `DESIGNER/${PREFIX}/FILE_DELETED`
export const FILE_DELETE_FAILED = `DESIGNER/${PREFIX}/FILE_DELETE_FAILED`

export const DIRECTORY_DELETE_STARTED = `DESIGNER/${PREFIX}/DIRECTORY_DELETE_STARTED`
export const DIRECTORY_DELETED = `DESIGNER/${PREFIX}/DIRECTORY_DELETED`
export const DIRECTORY_DELETE_FAILED = `DESIGNER/${PREFIX}/DIRECTORY_DELETE_FAILED`

export const FILE_RENAME_STARTED = `DESIGNER/${PREFIX}/FILE_RENAME_STARTED`
export const FILE_RENAMED = `DESIGNER/${PREFIX}/FILE_RENAMED`
export const FILE_RENAME_FAILED = `DESIGNER/${PREFIX}/FILE_RENAME_FAILED`

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

const allFilesSaved = (files: FileModel[]) => {
  files.forEach(file => fileSaved(file))
}

export const fileRenamed = (element: ElementModel, name: string) => ({
    type: FILE_RENAMED,
    payload: {element, name}
})

export const fileDeleted = (path: Path) => ({
    type: FILE_DELETED,
    payload: path
})

export const directoryDeleted = (path: Path) => ({
    type: DIRECTORY_DELETED,
    payload: path
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

export const addBulkFiles = (files:Array)  =>
  (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs): void => {
    if (!repositoryContainer.isLoaded)
      return dispatch(error(FILE_ADD_FAILED, REPOSITORY_NOT_LOADED))
    const repository: Repository = repositoryContainer.repository
    files.forEach(f => {
      mkdirs(f.filename, repository)(dispatch, getState, {repositoryContainer}).then(c => {
        if (!repository.getByPathString('/' + f.filename)) {
          const file = repository.addFile(c.parentPath, c.name, f.content)
          return dispatch(fileAdded(Factory.fileModel(file)))
        } else {
          const file = repository.setContent(Path.fromString('/' + f.filename), f.content)
          return dispatch(fileContentUpdated(Factory.fileModel(file), f.content))
        }
      })
    })
  }

const mkdirs = (filename:string, repository:Repository) =>
  (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs): Promise<any> => {
    const names = filename.split('/')
    let parentPath = '/'
    let dirname = ''
    const result = []
    for(let i = 0; i < names.length - 1; i++) {
      dirname = names[i]
      const path = parentPath + dirname + '/'
      const dir = repository.getByPathString(path);
      if (!dir) {
        result.push(addDirectory(Path.fromString(parentPath), dirname)(dispatch, getState, {repositoryContainer}))
      }
      parentPath = path
    }
    return Promise.all(result).then(() => {return Promise.resolve({parentPath:Path.fromString(parentPath), name: names[names.length - 1]})})
  }

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

export const saveAll = () =>
  (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs): Promise<any> => {
    if (!repositoryContainer.isLoaded)
      return Promise.reject(dispatch(error(FILE_SAVE_FAILED, REPOSITORY_NOT_LOADED)))

    const repository: Repository = repositoryContainer.repository
    dispatch({type: FILE_SAVE_STARTED})

    return repository.saveAll()
      .then(
        (files) => {
          var fileModels = files.map(file => Factory.fileModel(file))
          dispatch(allFilesSaved(fileModels))
        },
        () => { dispatch(error(FILE_SAVE_FAILED, 'Error on save')) })
  }

export const rename = (oldName: string, newName: string) =>
  (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs): Promise<any> => {
    if (!repositoryContainer.isLoaded)
      return Promise.reject(dispatch(error(FILE_RENAME_FAILED, REPOSITORY_NOT_LOADED)))

    const oldPath = getFileTree(getState()) ? getFileTree(getState()).getByPathString(oldName) : undefined

    if (!oldPath || (oldPath.isDirectory() && !isValidDirectory(oldPath)))
      return Promise.reject(dispatch(error(FILE_RENAME_FAILED, `${oldName} is not valid directory`)))
    else {
      if (!isValidFile(oldPath))
        return Promise.reject(dispatch(error(FILE_RENAME_FAILED, `${oldName} is not valid file`)))
    }

    const repository: Repository = repositoryContainer.repository
    dispatch({type: FILE_RENAME_STARTED})

    return repository.rename(oldName, newName)
      .then(
        () => dispatch(fileRenamed(oldPath, newName)),
        () => { dispatch(error(FILE_RENAME_FAILED, 'Error on renameElement')) }
      )
  }

const removeDirectory = (path: Path, dispatch: Dispatch, repository: Repository) => {
  if (!isValidDirectory(path))
    return Promise.reject(dispatch(error(DIRECTORY_DELETE_FAILED, `${path.toString()} is not valid folder`)))

  dispatch({type: DIRECTORY_DELETE_STARTED})
  return repository.deleteDirectory(path)
    .then(
      () => {
        dispatch(directoryDeleted(path))
        dispatch(clean())
      },
      () => { dispatch(error(DIRECTORY_DELETE_FAILED, 'Error on delete')) }
    )
}

const removeFile = (path: Path, dispatch: Dispatch, repository: Repository) => {
  if (!isValidFile(path))
    return Promise.reject(dispatch(error(FILE_DELETE_FAILED, `${path.toString()} is not valid file`)))

  dispatch({type: FILE_DELETE_STARTED})
  return repository.deleteFile(path)
    .then(
      () => {
        dispatch(fileDeleted(path))
        dispatch(clean())
      },
      () => { dispatch(error(FILE_DELETE_FAILED, 'Error on delete')) }
    )
}

export const remove = (path: Path) =>
  (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs): Promise<any> => {
    if (!repositoryContainer.isLoaded)
      return Promise.reject(dispatch(error(FILE_DELETE_FAILED, REPOSITORY_NOT_LOADED)))

    const repository: Repository = repositoryContainer.repository

    if (repository.getByPath(path).isDirectory()) {
      removeDirectory(path, dispatch, repository)
    } else {
      removeFile(path, dispatch, repository)
    }
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