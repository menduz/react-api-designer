// @flow

import type {State} from './ExportModel'
import * as actions from './ExportActions'

const initialState = {
  exportName: 'api.zip',
  type: 'zip',
  showModal: false,
  isExporting: false,
  showError: false
}

export default (state: State = initialState, action: any): State => {
  switch (action.type) {
    case actions.CHANGE_TYPE:
      const type = action.payload.type.value;
      return {
        ...state,
        type: type,
        exportName: 'api.' + type
      }
    case actions.SHOW:
      return {
        ...state,
        showModal: true
      }
    case actions.HIDE:
      return {
        ...state,
        showModal: false
      }
    case actions.CHANGE_NAME: {
      return {
        ...state,
        exportName: action.payload.name
      }
    }
    case actions.EXPORT_STARTED:
      return {
        ...state,
        isExporting: true
      }
    case actions.EXPORT_FAILED: {
      return {
        ...state,
        isExporting: false,
        showError: true
      }
    }
    case actions.EXPORT_DONE:
      return initialState
    default:
      return state
  }
}
