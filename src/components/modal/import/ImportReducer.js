//@flow

import type {State} from './ImportModel'
import * as actions from './ImportActions'

const initialState : State = {
  showModal: false,
  selectValue: 'RAML-file',
  isImporting: false,
  zipFiles:[]
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
        fileToImport: action.payload.event.value
      }
    case actions.UPLOAD_TEMP_FILE:
      return {
        ...state,
        fileNameToImport:action.payload.fileName,
        fileType:action.payload.type,
        fileToImport: action.payload.content
      }
    case actions.SHOW_ZIP_CONFLICT_MODAL:
      return {
        ...state,
        showZipConflictModal: true
      }
    case actions.HIDE_ZIP_CONFLICT_MODAL:
      return {
        ...state,
        showZipConflictModal: false
      }

    case actions.ADD_ZIP_FILES:
      return {
        ...state,
        zipFiles: action.payload.zipFiles
      }

    case actions.ZIP_FILE_OVERRIDE_ACTION:
      const override = action.payload.override
      const fileName = action.payload.filename

      const zipFiles = state.zipFiles.map(t =>
      {return (t.filename === fileName)?Object.assign({}, t, {override: override}):t})

      return {
        ...state,
        zipFiles: zipFiles
      }

    case actions.SHOW_CONFLICT_MODAL:
      return {
        ...state,
        showConflictModal: true
      }
    case actions.HIDE_CONFLICT_MODAL:
      return {
        ...state,
        showConflictModal: false
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
