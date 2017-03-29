// @flow

import {Map} from 'immutable'

import type {State} from './model'

import {
  FILE_ADDED, FILE_DELETED, ELEMENT_RENAMED, ELEMENT_MOVED,
  DIRECTORY_ADDED, DIRECTORY_DELETED,
  INIT_FILE_SYSTEM, FILE_SAVED, FILE_CONTENT_UPDATED,
  FILE_SAVE_STARTED, FILE_DELETE_STARTED, DIRECTORY_DELETE_STARTED,
  ELEMENT_RENAME_STARTED, DIRECTORY_ADD_STARTED, ELEMENT_MOVE_STARTED,
  DIRECTORY_ADD_FAILED, FILE_ADD_FAILED, FILE_SAVE_FAILED,
  ELEMENT_RENAME_FAILED, DIRECTORY_DELETE_FAILED, FILE_DELETE_FAILED,
  FILE_CONTENT_UPDATE_FAILED, ELEMENT_MOVE_FAILED, LOADING_FILE_SYSTEM,
} from './actions'
import Path from '../repository/Path'
import {ElementModel} from '../repository/immutable/RepositoryModel'

const initialState: State = {
  fileTree: undefined,
  contents: Map(),
  progress: true,
  error: '',
}

type RepositoryAction = { type: string, payload: any }

const moveElementContent = (contents: Map<string, string>, oldPath: Path, newPath: Path, isDirectory: boolean) => {
  if (isDirectory) return moveDirectoryContent(contents, oldPath, newPath)
  return moveFileContent(contents, oldPath, newPath)
}

const moveDirectoryContent = (contents: Map<string, string>, oldPath: Path, newPath: Path): Map<string, string> => {
  return contents
    .keySeq()
    .map(Path.fromString)
    .filter(p => p.isDescendantOf(oldPath))
    .reduce(
      (result: Map<string, string>, value: Path) =>
        moveFileContent(result, value, Path.mergePath(newPath, oldPath.relativePathTo(value))),
      contents,
    )
}

const moveFileContent = (contents: Map<string, string>, oldPath: Path, newPath: Path): Map<string, string> => {
  const oldPathString = oldPath.toString()
  if (!contents.has(oldPathString)) return contents
  const content = contents.get(oldPathString)
  return contents
    .remove(oldPathString)
    .set(newPath.toString(), content)
}

const contentReducer = (contents: Map<string, string> = Map(), action: RepositoryAction): Map<string, string> => {
  switch (action.type) {
    case INIT_FILE_SYSTEM:
      return Map()
    case DIRECTORY_DELETED:
      const path: Path = action.payload
      return contents
        .keySeq()
        .map(Path.fromString)
        .filter(p => p.isDescendantOf(path))
        .reduce(
          (result: Map<string, string>, value: Path) => result.remove(value.toString()),
          contents,
        )
    case FILE_DELETED:
      return contents.remove(action.payload.toString())
    case ELEMENT_RENAMED:
      const element = action.payload.element
      return moveElementContent(contents, action.payload.oldPath, element.path, element.isDirectory)
    case FILE_CONTENT_UPDATED:
      const {file, content} = action.payload
      return contents.set(file.path.toString(), content)
    case ELEMENT_MOVED:
      return moveElementContent(contents, action.payload.source, action.payload.destination, action.payload.isDirectory)
    default:
      return contents
  }
}

const reducer = (state: State = initialState, action: RepositoryAction): State => {
  switch (action.type) {
    case LOADING_FILE_SYSTEM:
      return initialState
    case INIT_FILE_SYSTEM:
      return {
        ...state,
        progress: false,
        fileTree: action.payload,
        contents: contentReducer(state.contents, action),
      }
    case DIRECTORY_DELETED:
    case FILE_DELETED:
      if (!state.fileTree) return state
      return {
        ...state,
        progress: false,
        fileTree: state.fileTree.removeElement(action.payload),
        contents: contentReducer(state.contents, action),
      }
    case ELEMENT_RENAMED:
      if (!state.fileTree) return state
      return {
        ...state,
        progress: false,
        fileTree: state.fileTree.removeElement(action.payload.oldPath).updateElement(action.payload.element),
        contents: contentReducer(state.contents, action),
      }
    case FILE_ADDED:
    case FILE_SAVED:
    case DIRECTORY_ADDED:
      if (!state.fileTree) return state
      return {
        ...state,
        progress: false,
        fileTree: state.fileTree.updateElement(action.payload),
        contents: contentReducer(state.contents, action),
      }
    case FILE_CONTENT_UPDATED:
      if (!state.fileTree) return state
      const {file} = action.payload
      return {
        ...state,
        fileTree: state.fileTree.updateElement(file),
        contents: contentReducer(state.contents, action),
      }
    case ELEMENT_MOVED:
      if (!state.fileTree) return state
      return {
        ...state,
        progress: false,
        fileTree: state.fileTree.moveElement(action.payload.source, action.payload.destination),
        contents: contentReducer(state.contents, action),
      }
    case DIRECTORY_ADD_FAILED:
    case FILE_ADD_FAILED:
    case FILE_SAVE_FAILED:
    case ELEMENT_RENAME_FAILED:
    case DIRECTORY_DELETE_FAILED:
    case FILE_DELETE_FAILED:
    case FILE_CONTENT_UPDATE_FAILED:
    case ELEMENT_MOVE_FAILED:
      console.error('Repository error:', action.payload)
      return {
        ...state,
        progress: false,
        error: action.payload,
        contents: contentReducer(state.contents, action),
      }
    case FILE_SAVE_STARTED:
    case FILE_DELETE_STARTED:
    case DIRECTORY_DELETE_STARTED:
    case ELEMENT_RENAME_STARTED:
    case DIRECTORY_ADD_STARTED:
    case ELEMENT_MOVE_STARTED:
      return {
        ...state,
        progress: true, error: '',
        contents: contentReducer(state.contents, action),
      }
    default:
      return state
  }
}

export default reducer