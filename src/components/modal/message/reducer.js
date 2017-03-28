// @flow

import * as actions from './actions'
import type {State} from "./model";

const initialState: State = {
  isOpen: false,
  message: '',
  title: ''
}

export default (state: State = initialState, action: any) => {
  switch (action.type) {
    case actions.CLEAR:
      return initialState
    case actions.OPEN_MODAL:
      return {
        ...state,
        isOpen: true
      }
    case actions.SET_CONTENT:
      return {
        ...state,
        message: action.payload.message,
        title: action.payload.title
      }
    default:
      return state
  }
}