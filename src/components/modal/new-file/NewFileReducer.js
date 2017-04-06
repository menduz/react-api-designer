//@flow

import * as actions from './NewFileActions'
import type {State} from './NewFileModel'

const initialState : State = {
  fileName: '',
  fileTypeOptions: [],
  fileType: undefined,
  fragmentType: undefined,
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
        fragmentType: state.fileTypeOptions[0].subTypes? state.fileTypeOptions[0].subTypes[0]: undefined,
        fileName: action.payload.fileName
      }
    case actions.CHANGE_FRAGMENT:
      return {
        ...state,
        fragmentType: action.payload.type,
        fileName: action.payload.fileName
      }
    case actions.SHOW:
      const fileTypes = action.payload.fileTypeOptions;
      return {
        ...state,
        showModal: true,
        fileName: action.payload.defaultName,
        path: action.payload.path,
        fileTypeOptions: fileTypes,
        fileType: fileTypes[0],
        fragmentType: fileTypes[0].subTypes[0],
      }
    case actions.HIDE:
      return initialState
    default:
      return state
  }
}
