//@flow

import type {State} from './ImportModel'
import * as actions from './ImportActions'

const initialState : State = {
  showModal: false,
  selectValue: 'RAML-file',
  isImporting: false
}

export default (state: State = initialState, action: any): State => {
  switch (action.type) {
    case actions.HIDE:
      return {
        ...state,
        showModal: false
      }
    case actions.SHOW:
      return {
        ...state,
        showModal: true
      }
    case actions.CHANGE_TYPE:
      return {
        ...state,
        selectValue: action.payload.type.value
      }
    case actions.CHANGE_URL:
      return {
        ...state,
        url: action.payload.url
      }
    case actions.FILE_UPLOAD:
      return {
        ...state,
        fileToImport: action.payload.event.target
      }
    case actions.IMPORT_STARTED:
      return {
        ...state,
        isImporting: true
      }
    case actions.IMPORT_DONE:
    default:
      return initialState
  }
}
