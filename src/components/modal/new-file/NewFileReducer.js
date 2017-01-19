//@flow

import type {State} from './NewFileModel'
import * as actions from './NewFileActions'

const initialState : State = {
  fileName: '',
  fileType: '',
  showNewFolderModal: false
}

export default (state: State = initialState, action: any): State => {
  switch (action.type) {
    case actions.CHANGE_NAME:
      return {
        ...state,
        fileName: action.payload.name
      }
    case actions.CHANGE_TYPE:
      return {
        ...state,
        fileType: action.payload.type
      }
    case actions.SHOW:
      return {
        ...state,
        showNewFolderModal: true
      }
    case actions.HIDE:
    case actions.CREATE:
    default:
      return initialState
  }
}
