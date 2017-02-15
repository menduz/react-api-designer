// @flow

import {Set} from 'immutable'
import type {State} from './model'
import {NODE_SELECTED, PATH_SELECTED, EXPAND_FOLDER, NOT_EXPAND_FOLDER} from './actions'

const initialState: State = {
  currentPath: undefined,
  expandedFolders: new Set()
}

const reducer = (state: State = initialState, action: {type: string, payload: any}): State => {
  switch (action.type) {
    case EXPAND_FOLDER:
      return {
        ...state,
        expandedFolders: state.expandedFolders.add(action.payload)
      }
    case NOT_EXPAND_FOLDER:
      return {
        ...state,
        expandedFolders: state.expandedFolders.delete(action.payload)
      }
    case NODE_SELECTED:
    case PATH_SELECTED:
      return {
        ...state,
        currentPath: action.payload
      }
    default:
      return state
  }
}

export default reducer