//@flow

import type {State} from './UnsavedModel'
import * as actions from './UnsavedActions'

const initialState : State = {
  showModal: false,
  saving: false,
  finishAction: ''
}

export default (state: State = initialState, action: any): State => {
  switch (action.type) {
    case actions.SHOW:
      return {
        ...state,
        showModal: true,
        finishAction: action.payload
      }
    case actions.SAVING:
      return {
        ...state,
        saving: true
      }
    case actions.HIDE:
      return initialState
    default:
      return state
  }
}
