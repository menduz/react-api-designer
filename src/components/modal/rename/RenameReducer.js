//@flow

import type {State} from './RenameModel'
import * as actions from './RenameActions'
import Path from '../../../repository/Path'

const initialState : State = {
  newName: '',
  path: Path.emptyPath(),
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
        path: action.payload,
        showModal: true
      }
    case actions.HIDE:
      return initialState
    default:
      return state
  }
}
