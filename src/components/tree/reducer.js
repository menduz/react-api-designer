// @flow

import {Set} from 'immutable'
import type {State} from './model'
import {NODE_SELECTED, PATH_SELECTED} from './actions'

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
    default:
      return state
  }
}

export default reducer