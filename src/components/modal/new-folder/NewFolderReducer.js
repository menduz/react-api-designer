//@flow

import * as actions from './NewFolderActions'
import type {State} from './NewFolderModel'

const initialState = {
  showModal: false,
  folderName: '',
  path: undefined
}

export default (state: State = initialState, action: any): State => {
  switch (action.type) {
    case actions.CHANGE_NAME:
      return {
        ...state,
        folderName: action.payload
      }
    case actions.SHOW:
      return {
        ...state,
        showModal: true,
        path: action.payload ? action.payload : state.path
      }
    case actions.HIDE:
    case actions.CLEAR:
      return initialState
    default:
      return state
  }
}
