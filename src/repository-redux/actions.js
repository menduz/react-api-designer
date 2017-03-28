// @flow

import {PREFIX} from './constants'
import {FileModel, DirectoryModel, RepositoryModel, ElementModel} from '../repository/immutable/RepositoryModel'
import Factory from '../repository/immutable/RepositoryModelFactory'

import Repository from '../repository/Repository'
import type {SaveResult} from '../repository/Repository'

import {Path} from '../repository'
import {isValidDirectory, isValidFile, getFileTree} from './selectors'
import {getCurrentFilePath} from '../components/editor/selectors'
import {clean} from '../components/editor/actions'
import {addSuccessToasts} from '../components/toasts/actions'
import {addErrorToasts} from '../components/toasts/actions'
import {File} from '../repository'

import defaultContentJson from './default-content.json'
import type {Dispatch, GetState, ExtraArgs} from '../types'

export const LOADING_FILE_SYSTEM = `DESIGNER/${PREFIX}/LOADING_FILE_SYSTEM`
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

export const FILE_MOVE_STARTED = `DESIGNER/${PREFIX}/FILE_MOVE_STARTED`
export const FILE_MOVED = `DESIGNER/${PREFIX}/FILE_MOVE`
export const FILE_MOVE_FAILED = `DESIGNER/${PREFIX}/FILE_MOVE_FAILED`

export const REPOSITORY_NOT_LOADED = 'Repository not loaded!'


export const loadingFileSystem = () => ({
  type: LOADING_FILE_SYSTEM
})

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

export const fileRenamed = (oldPath: Path, element: ElementModel) => ({
  type: FILE_RENAMED,
  payload: {oldPath, element}
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

export const error = (type: string, errorMessage: string) =>
  (dispatch: Dispatch) => {
    dispatch({type, payload: errorMessage})
    dispatch(addErrorToasts(errorMessage))
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
        (directory) => {
          dispatch(directoryAdded(Factory.directoryModel(directory)))
        }
      )
      .catch(
        (err) => dispatch(error(DIRECTORY_ADD_FAILED, err || 'Error on create directory'))
      )
  }

const mkdirs = (filename: string, repository: Repository) =>
  (dispatch: Dispatch): Promise<any> => {
    const names = filename.split('/')
    let parentPath = '/'
    let dirname = ''
    let sequence = Promise.resolve()
    for (let i = 0; i < names.length - 1; i++) {
      dirname = names[i]
      const path = parentPath + dirname + '/'
      const dir = repository.getByPathString(path);
      if (!dir) {
        const c = parentPath
        const d = dirname
        sequence = sequence.then(() => {
          return dispatch(addDirectory(Path.fromString(c), d))
        })
      }
      parentPath = path
    }
    return sequence.then(() => {
      return Promise.resolve({parentPath: Path.fromString(parentPath), name: names[names.length - 1]})
    })
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

const successSaving = (dispatch: Dispatch, msg: string, {repository, file, content}: SaveResult) => {
  dispatch(initFileSystem(Factory.repository(repository)))
  if (file && content) dispatch(updateFileContent(file.path, content))
  dispatch(addSuccessToasts(msg))
}

export const addBulkFiles = (files: []) =>
  (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs): Promise<any> => {
    if (!repositoryContainer.isLoaded)
      return Promise.reject(dispatch(error(FILE_ADD_FAILED, REPOSITORY_NOT_LOADED)))

    const repository: Repository = repositoryContainer.repository
    const importedFiles: File[] = []

    return Promise.all(files.map(f => dispatch(mkdirs(f.filename, repository)))).then(() => {
      Promise.all(files.map(f => {
        return dispatch(mkdirs(f.filename, repository)).then(c => {
          if (!repository.getByPathString('/' + f.filename)) {
            const file: File = repository.addFile(c.parentPath, c.name, f.content)
            importedFiles.push(file)
            return dispatch(fileAdded(Factory.fileModel(file)))
          } else {
            const file: File = repository.setContent(Path.fromString('/' + f.filename), f.content)
            importedFiles.push(file)
            return dispatch(fileContentUpdated(Factory.fileModel(file), f.content))
          }
        })
      })).then(() => {
        repository.saveFiles(importedFiles, null)
          .then((result) => successSaving(dispatch, 'All imported files saved', result))
          .catch(() => dispatch(error(FILE_SAVE_FAILED, 'Error saving importing files')))
      })
    })
  }

export const addFile = (parentPath: Path, name: string, fileType?: string) =>
  (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs): ?File => {
    if (!repositoryContainer.isLoaded)
      return dispatch(error(FILE_ADD_FAILED, REPOSITORY_NOT_LOADED))
    if (!isValidDirectory(parentPath))
      return dispatch(error(FILE_ADD_FAILED, `${parentPath.toString()} is not valid directory`))

    const defaultContent = fileType? defaultContentJson[fileType] || '' : ''
    const repository: Repository = repositoryContainer.repository
    const file: File = repository.addFile(parentPath, name, defaultContent)
    dispatch(fileAdded(Factory.fileModel(file)))
    return file
  }

export const saveFile = (path: Path) =>
  (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs): Promise<any> => {
    if (!repositoryContainer.isLoaded)
      return Promise.reject(dispatch(error(FILE_SAVE_FAILED, REPOSITORY_NOT_LOADED)))
    if (!isValidFile(path))
      return Promise.reject(dispatch(error(FILE_SAVE_FAILED, `${path.toString()} is not valid file`)))

    const repository = repositoryContainer.repository
    dispatch({type: FILE_SAVE_STARTED})
    return repository.saveFile(path)
      .then((file) => {
        dispatch(fileSaved(Factory.fileModel(file)))
        dispatch(addSuccessToasts(`${file.name} saved`))
      })
      .catch(() => dispatch(error(FILE_SAVE_FAILED, 'Error on saving')))
  }

export const saveAll = () =>
  (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs): Promise<any> => {
    if (!repositoryContainer.isLoaded)
      return Promise.reject(dispatch(error(FILE_SAVE_FAILED, REPOSITORY_NOT_LOADED)))

    const repository: Repository = repositoryContainer.repository
    dispatch({type: FILE_SAVE_STARTED})

    const currentFile = getCurrentFilePath(getState())
    return repository.saveAll(currentFile)
      .then((result) => successSaving(dispatch, 'All files saved', result))
      .catch((e) => {
        console.log(e)
        dispatch(error(FILE_SAVE_FAILED, 'Error on save all'))
      })
  }

export const rename = (path: string, newName: string) =>
  (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs): Promise<any> => {
    if (!repositoryContainer.isLoaded)
      return Promise.reject(dispatch(error(FILE_RENAME_FAILED, REPOSITORY_NOT_LOADED)))

    const fileTree = getFileTree(getState())
    const element = fileTree ? fileTree.getByPathString(path) : undefined

    if (!element || !isValidDirectory(element) || !isValidFile(element))
      return Promise.reject(dispatch(error(FILE_RENAME_FAILED, `${path} is not valid`)))

    const repository: Repository = repositoryContainer.repository
    dispatch({type: FILE_RENAME_STARTED})

    return repository.rename(path, newName)
      .then(
        (elem) => dispatch(fileRenamed(Path.fromString(path), Factory.elementModel(elem)))
      ).catch(
        (err) => dispatch(error(FILE_RENAME_FAILED, err || 'Error on renameElement'))
      )
  }

const removeDirectory = (path: Path, dispatch: Dispatch, repository: Repository): Promise<any> => {
  if (!isValidDirectory(path))
    return Promise.reject(dispatch(error(DIRECTORY_DELETE_FAILED, `${path.toString()} is not valid folder`)))

  dispatch({type: DIRECTORY_DELETE_STARTED})
  return repository.deleteDirectory(path)
    .then(
      () => {
        dispatch(directoryDeleted(path))
        dispatch(clean())
      })
    .catch(
      (err) => dispatch(error(DIRECTORY_DELETE_FAILED, err || 'Error on delete'))
    )
}

const removeFile = (path: Path, dispatch: Dispatch, repository: Repository): Promise<any> => {
  if (!isValidFile(path))
    return Promise.reject(dispatch(error(FILE_DELETE_FAILED, `${path.toString()} is not valid file`)))

  dispatch({type: FILE_DELETE_STARTED})
  return repository.deleteFile(path)
    .then(
      () => {
        dispatch(fileDeleted(path))
        dispatch(clean())
      })
    .catch(
      (err) => dispatch(error(FILE_DELETE_FAILED, err || 'Error on delete'))
    )
}

export const remove = (path: Path) =>
  (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs): Promise<any> => {
    if (!repositoryContainer.isLoaded)
      return Promise.reject(dispatch(error(FILE_DELETE_FAILED, REPOSITORY_NOT_LOADED)))

    const repository: Repository = (repositoryContainer.repository: Repository)

    const element = repository.getByPath(path)
    if (!element)
      return Promise.reject(dispatch(error(FILE_RENAME_FAILED, `${path.toString()} is not valid`)))

    if (element.isDirectory()) {
      return removeDirectory(path, dispatch, repository)
    } else {
      return removeFile(path, dispatch, repository)
    }
  }

export const moveElement = (source: Path, destinationDir: Path) =>
  (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs): Promise<any> => {
    if (!repositoryContainer.isLoaded)
      return Promise.reject(dispatch(error(FILE_MOVE_FAILED, REPOSITORY_NOT_LOADED)))

    const fileTree = getFileTree(getState())
    if (!fileTree) return Promise.reject()

    const fromElement = fileTree.getByPath(source)
    const toElement = fileTree.getByPath(destinationDir)
    if (!fromElement || !toElement) return Promise.reject()

    const isInvalidDestination = !isValidDirectory(toElement)
    const isInvalidSource = !isValidFile(fromElement) || !isValidDirectory(fromElement)

    if (isInvalidDestination || isInvalidSource) {
      const invalid: Path = isInvalidDestination ? destinationDir : source
      return Promise.reject(dispatch(error(FILE_MOVE_FAILED, `${invalid.toString()} is not valid`)))
    }

    dispatch({type: FILE_MOVE_STARTED})
    const destinationPath = Path.fromString(destinationDir.toString() + '/' + fromElement.name)
    const repository: Repository = repositoryContainer.repository
    return repository.move(source, destinationPath)
      .then(
        (element) => {
          dispatch({type: FILE_MOVED, payload: {source, destination: element.path}})
          dispatch(addSuccessToasts(`${element.isDirectory() ? 'Directory' : 'File'} '${element.name}' moved`))
        }
      )
      .catch(
        (err) => dispatch(error(FILE_MOVE_FAILED, err || 'Move failed'))
      )
  }
