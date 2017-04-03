// @flow

import {API_PROJECT} from './model'
import {INITIALIZED, CLEAN, INITIALIZING} from './constants'

import type {State} from './model'

const initialState: State = {
  initializing: true,
  projectId: '',
  projectType: API_PROJECT,
}

const reducer = (state: State = initialState, action: {type: string, payload: any}): State => {
  switch (action.type) {
    case INITIALIZING:
      return {
        ...state,
        initializing: true,
        projectId: action.payload.projectId,
        projectType: action.payload.projectType
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