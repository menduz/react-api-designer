//@flow

import type {State} from './NewFileModel'
import {fileTypes} from './NewFileModel'
import * as actions from './NewFileActions'

const initialState : State = {
  fileName: '',
  fileType: undefined,
  fragmentType: fileTypes[0].subTypes[0],
  showModal: false
}

export default (state: State = initialState, action: any): State => {
  switch (action.type) {
    case actions.CHANGE_NAME:
      return {
        ...state,
        fileName: action.payload
      }
    case actions.CHANGE_TYPE:
      return {
        ...state,
        fileType: action.payload.type,
        fragmentType: initialState.fragmentType,
        fileName: action.payload.fileName
      }
    case actions.CHANGE_FRAGMENT:
      return {
        ...state,
        fragmentType: action.payload.type,
        fileName: action.payload.fileName
      }
    case actions.SHOW:
      return {
        ...state,
        showModal: true
      }
    case actions.HIDE:
      return initialState
    default:
      return state
  }
}
