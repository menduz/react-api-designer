//@flow

import type {State} from './ImportModel'
import * as actions from './ImportActions'
import {REPLACE_ALL, ALL_FILES_ACTION} from './zipfile/constants'

const initialState : State = {
  showModal: false,
  selectValue: 'RAML-file',
  isImporting: false,
  allFilesAction: REPLACE_ALL,
  zipFileAction: ALL_FILES_ACTION
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

    case actions.ALL_FILES_ACTION_CHANGE:
      return {
        ...state,
        allFilesAction: action.payload.value
      }
    case actions.ADD_ZIP_FILES:
      return {
        ...state,
        zipFiles: action.payload.zipFiles
      }

    case actions.ZIP_FILE_ACTION:
      return {
        ...state,
        zipFileAction: action.payload.value
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
