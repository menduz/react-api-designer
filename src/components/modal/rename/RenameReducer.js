//@flow

import type {State} from './RenameModel'
import * as actions from './RenameActions'

const initialState : State = {
  newName: '',
  oldName: '',
  showModal: false
}

export default (state: State = initialState, action: any): State => {
  switch (action.type) {
    case actions.CHANGE_NAME:
      return {
        ...state,
        newName: action.payload
      }
    case actions.SHOW:
      return {
        ...state,
        oldName: action.payload,
        showModal: true
      }
    case actions.HIDE:
      return initialState
    default:
      return state
  }
}
