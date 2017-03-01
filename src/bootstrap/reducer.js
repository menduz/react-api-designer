// @flow

import State from './model'
import { INIT, CLEAN, INITIALIZING } from './actions'

const initialState:State = {
  initializing: true,
  remoteApiDataProvider: null
}

const reducer = (state: State = initialState, action: {type: string, payload: any}): State => {
  switch (action.type) {
    case INITIALIZING:
      return {
        ...state,
        initializing: true
      }
    case INIT:
      return {
        ...state,
        initializing: false,
        remoteApiDataProvider: action.payload
      }
    case CLEAN:
      return {
        ...state,
        initializing: true,
        remoteApiDataProvider: null
      }
    default:
      return state
  }
}

export default reducer