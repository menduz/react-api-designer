// @flow

import {Set} from 'immutable'
import type {State} from './model'
import {NODE_SELECTED, TREE_CHANGED, PATH_SELECTED} from './actions'

const initialState: State = {
  currentPath: undefined,
  expandedFiles: Set()
}

const reducer = (state: State = initialState, action: {type: string, payload: any}): State => {
  switch (action.type) {

    case NODE_SELECTED:
    case PATH_SELECTED:
      return {
        ...state,
        currentPath: action.payload
      }
    case TREE_CHANGED:
    default:
      return state
  }
}

export default reducer