//@flow

import type {State} from './ImportModel'
import * as actions from './ImportActions'

const initialState: State = {
  showModal: false,
  selectValue: 'RAML-file',
  isImporting: false,
  zipFiles: [],
  error: '',
  fileNameToImport: '',
  showConflictModal: false,
  showZipConflictModal: false,
  zipWithDependencies:false
}

export default (state: State = initialState, action: any): State => {
  switch (action.type) {
    case actions.SHOW:
      return {
        ...initialState,
        showModal: true,
        fileToImport: action.payload.file ? action.payload.file : state.fileToImport
      }
    case actions.CHANGE_ERROR:
      return {
        ...state,
        error: action.payload.error,
        isImporting: false
      }
    case actions.CHANGE_TYPE:
      return {
        ...state,
        selectValue: action.payload.type.value,
        error: ''
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
        fileNameToImport: action.payload.fileName,
        fileType: action.payload.type,
        fileToImport: action.payload.content
      }
    case actions.SHOW_ZIP_CONFLICT_MODAL:
      return {
        ...state,
        showZipConflictModal: true,
        isImporting: false
      }

    case actions.ADD_ZIP_FILES:
      return {
        ...state,
        zipFiles: action.payload.zipFiles
      }

    case actions.ZIP_WITH_DEPENDENCIES:
      return {
        ...state,
        zipWithDependencies: action.payload.zipWithDependencies
      }

    case actions.ZIP_FILE_OVERRIDE_ACTION:
      const override = action.payload.override
      const fileName = action.payload.filename

      const zipFiles = state.zipFiles
        .map(t => {
          return (t.filename === fileName) ? Object.assign({}, t, {override: override}) : t
        })

      return {
        ...state,
        zipFiles: zipFiles
      }

    case actions.SHOW_CONFLICT_MODAL:
      return {
        ...state,
        showConflictModal: true,
        isImporting: false
      }
    case actions.IMPORT_STARTED:
      return {
        ...state,
        isImporting: true,
        error: ''
      }
    case actions.HIDE_CONFLICT_MODAL:
      return {
        ...state,
        showConflictModal: false,
        isImporting: false
      }
    case actions.HIDE:
    case actions.HIDE_ZIP_CONFLICT_MODAL:
    case actions.IMPORT_DONE:
      return initialState
    default:
      return state
  }
}
