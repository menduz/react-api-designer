// @flow

import {Set} from 'immutable'
import type {State} from './model'
import {NODE_SELECTED, PATH_SELECTED, EXPAND_FOLDER, NOT_EXPAND_FOLDER, CLEAN,
  UPDATE_DEPENDENCIES_STARTED, UPDATE_DEPENDENCIES_FAILED, UPDATE_DEPENDENCIES_DONE} from './actions'

const initialState: State = {
  currentPath: undefined,
  updating: false,
  expandedFolders: new Set()
}

const reducer = (state: State = initialState, action: {type: string, payload: any}): State => {
  switch (action.type) {
    case EXPAND_FOLDER:
      return {
        ...state,
        expandedFolders: state.expandedFolders.add(action.payload.toString())
      }
    case NOT_EXPAND_FOLDER:
      return {
        ...state,
        expandedFolders: state.expandedFolders.delete(action.payload.toString())
      }
    case NODE_SELECTED:
    case PATH_SELECTED:
      return {
        ...state,
        currentPath: action.payload
      }
    case UPDATE_DEPENDENCIES_STARTED:
      return {
        ...state,
        updating: true
      }
    case UPDATE_DEPENDENCIES_FAILED:
    case UPDATE_DEPENDENCIES_DONE:
      return {
        ...state,
        updating: false
      }
    case CLEAN:
      return initialState
    default:
      return state
  }
}

export default reducer