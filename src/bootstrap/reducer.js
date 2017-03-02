// @flow

import State from './model'
import {INITIALIZED, CLEAN, INITIALIZING} from './constants'

const initialState: State = {
  initializing: true,
  projectId: ''
}

const reducer = (state: State = initialState, action: {type: string, payload: any}): State => {
  switch (action.type) {
    case INITIALIZING:
      return {
        ...state,
        initializing: true,
        projectId: action.payload
      }
    case INITIALIZED:
      return {
        ...state,
        initializing: false,
      }
    case CLEAN:
      return initialState
    default:
      return state
  }
}

export default reducer