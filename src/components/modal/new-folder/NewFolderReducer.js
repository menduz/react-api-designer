//@flow

import type {State} from './NewFolderModel'
import * as actions from './NewFolderActions'

const initialState = {
  showNewFolderModal: false,
  folderName: ''
}

export default (state: State = initialState, action: any): State => {
  switch (action.type) {
    case actions.CHANGE_NAME:
      return {
        ...state,
        folderName: action.payload.name
      }
    case actions.SHOW:
      return {
        ...state,
        showNewFolderModal: true
      }
    case actions.HIDE:
    case actions.CLEAR:
    case actions.CREATE:
    default:
      return initialState
  }
}
