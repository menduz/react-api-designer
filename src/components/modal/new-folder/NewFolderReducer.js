//@flow

import type {State} from './NewFolderModel'
import * as actions from './NewFolderActions'

const initialState = {
  showModal: false,
  folderName: ''
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
        showModal: true
      }
    case actions.HIDE:
    case actions.CLEAR:
    default:
      return initialState
  }
}
