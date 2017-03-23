// @flow

import {Map} from 'immutable'

import type {State} from './model'

import {
  FILE_ADDED, FILE_DELETED, FILE_RENAMED, FILE_MOVED,
  DIRECTORY_ADDED, DIRECTORY_DELETED,
  INIT_FILE_SYSTEM, FILE_SAVED, FILE_CONTENT_UPDATED,
  FILE_SAVE_STARTED, FILE_DELETE_STARTED, DIRECTORY_DELETE_STARTED,
  FILE_RENAME_STARTED, DIRECTORY_ADD_STARTED, FILE_MOVE_STARTED,
  DIRECTORY_ADD_FAILED, FILE_ADD_FAILED, FILE_SAVE_FAILED,
  FILE_RENAME_FAILED, DIRECTORY_DELETE_FAILED, FILE_DELETE_FAILED,
  FILE_CONTENT_UPDATE_FAILED, FILE_MOVE_FAILED, LOADING_FILE_SYSTEM,
  UPDATE_DEPENDENCIES_STARTED, UPDATE_DEPENDENCIES_FAILED, UPDATE_DEPENDENCIES_DONE
} from './actions'

const initialState: State = {
  fileTree: undefined,
  contents: Map(),
  progress: true,
  error: ''
}

const reducer = (state: State = initialState, action: {type: string, payload: any}): State => {
  switch (action.type) {
    case LOADING_FILE_SYSTEM:
      return initialState
    case INIT_FILE_SYSTEM:
      return {
        ...state,
        progress: false,
        fileTree: action.payload,
        contents: Map()
      }
    case DIRECTORY_DELETED:
    case FILE_DELETED:
      if (!state.fileTree) return state
      return {
        ...state,
        progress: false,
        fileTree: state.fileTree.removeElement(action.payload)
      }
    case FILE_RENAMED:
      if (!state.fileTree) return state
      return {
        ...state,
        progress: false,
        fileTree: state.fileTree.removeElement(action.payload.oldPath).updateElement(action.payload.element)
      }
    case FILE_ADDED:
    case FILE_SAVED:
    case DIRECTORY_ADDED:
      if (!state.fileTree) return state
      return {
        ...state,
        progress: false,
        fileTree: state.fileTree.updateElement(action.payload)
      }
    case FILE_CONTENT_UPDATED:
      if (!state.fileTree) return state
      const {file, content} = action.payload
      return {
        ...state,
        fileTree: state.fileTree.updateElement(file),
        contents: state.contents.set(file.path.toString(), content)
      }
    case FILE_MOVED:
      return {
        ...state,
        progress: false,
        fileTree: state.fileTree.moveElement(action.payload.source, action.payload.destination)
      }
    case DIRECTORY_ADD_FAILED:
    case FILE_ADD_FAILED:
    case FILE_SAVE_FAILED:
    case FILE_RENAME_FAILED:
    case DIRECTORY_DELETE_FAILED:
    case FILE_DELETE_FAILED:
    case FILE_CONTENT_UPDATE_FAILED:
    case FILE_MOVE_FAILED:
    case UPDATE_DEPENDENCIES_FAILED:
      console.error('Repository error:', action.payload)
      return {
        ...state,
        progress: false,
        error: action.payload
      }
    case UPDATE_DEPENDENCIES_DONE:
      return {
        ...state,
        progress: false,
        error: ''
      }

    case UPDATE_DEPENDENCIES_STARTED:
    case FILE_SAVE_STARTED:
    case FILE_DELETE_STARTED:
    case DIRECTORY_DELETE_STARTED:
    case FILE_RENAME_STARTED:
    case DIRECTORY_ADD_STARTED:
    case FILE_MOVE_STARTED:
      return {
        ...state,
        progress: true, error: ''
      }
    default:
      return state
  }
}

export default reducer