// @flow

import {Map} from 'immutable'

import type {State} from './model'

import {
  FILE_ADDED, FILE_DELETED, FILE_RENAMED,
  DIRECTORY_ADDED, DIRECTORY_DELETED,
  INIT_FILE_SYSTEM, FILE_SAVED, FILE_CONTENT_UPDATED
} from './actions'

const initialState: State = {
  fileTree: undefined,
  contents: Map()
}

const reducer = (state: State = initialState, action: {type: string, payload: any}): State => {
  switch (action.type) {
    case INIT_FILE_SYSTEM:
      return {
        ...state,
        fileTree: action.payload
      }
    case DIRECTORY_DELETED:
    case FILE_DELETED:
      if (!state.fileTree) return state
      return {
        ...state,
        fileTree: state.fileTree.removeElement(action.payload)
      }
    case FILE_RENAMED:
      if (!state.fileTree) return state
      return {
        ...state,
        fileTree: state.fileTree.renameElement(action.payload.element, action.payload.name)
      }
    case FILE_ADDED:
    case FILE_SAVED:
    case DIRECTORY_ADDED:
      if (!state.fileTree) return state
      return {
        ...state,
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
    default:
      return state
  }
}

export default reducer