//@flow

import {connect} from 'react-redux'

import ZipConflictModal from './ZipConflictModal'

import type {State} from '../ImportModel'

import {getAll} from '../ImportSelectors'
import {saveZipFiles, closeZipConflictDialog, allFilesActionChange, zipFileActionChange, zipFileOverrideAction} from '../ImportActions'

const mapState = (rootState) => {
  const state: State = getAll(rootState)
  return {
    showZipConflictModal: state.showZipConflictModal,
    allFilesAction: state.allFilesAction,
    fileToImport: state.fileToImport,
    fileNameToImport: state.fileNameToImport,
    fileType: state.fileType,
    zipFiles: state.zipFiles,
    zipFileAction: state.zipFileAction
  }
}

const mapDispatch = (dispatch) => {
  return {
    onSubmit: () => dispatch(saveZipFiles()),
    onCancel: () => dispatch(closeZipConflictDialog()),
    onAllFilesActionChange: (value: string) => dispatch(allFilesActionChange(value)),
    zipFileActionChange: (value: string) => dispatch(zipFileActionChange(value)),
    zipFileOverrideAction: (filename:string, override:boolean)=> dispatch(zipFileOverrideAction(filename, override))
  }
}

const ZipConflictModalContainer = connect(mapState, mapDispatch)(ZipConflictModal)

export default ZipConflictModalContainer
