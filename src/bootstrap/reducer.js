// @flow

import State from './model'
import {INIT, CLEAN, INITIALIZING} from './constants'

const initialState: State = {
  initializing: true,
  remoteApiDataProvider: null
}

const reducer = (state: State = initialState, action: {type: string, payload: any}): State => {
  switch (action.type) {
    case INITIALIZING:
      return {
        ...state,
        initializing: true,
        remoteApiDataProvider: action.payload
      }
    case INIT:
      return {
        ...state,
        initializing: false,
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