//@flow

import type {State} from './NewFileModel'
import * as actions from './NewFileActions'

const initialState : State = {
  fileName: '',
  fileType: 'RAML10',
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
        fileType: action.payload
      }
    case actions.SHOW:
      return {
        ...state,
        showModal: true
      }
    case actions.HIDE:
    default:
      return initialState
  }
}
