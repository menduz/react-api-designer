//@flow

import {connect} from 'react-redux'

import ZipConflictModal from './ZipConflictModal'

import type {State} from '../ImportModel'

import {getAll} from '../ImportSelectors'
import {saveZipFiles, closeZipConflictDialog, allFilesActionChange, zipFileActionChange} from '../ImportActions'

const mapState = (rootState) => {
  const state: State = getAll(rootState)
  return {
    showZipConflictModal: state.showZipConflictModal,
    allFilesAction: state.allFilesAction,
    fileToImport: state.fileToImport,
    fileNameToImport: state.fileNameToImport,
    fileType: state.fileType,
  }
}

const mapDispatch = (dispatch) => {
  return {
    onSubmit: () => dispatch(saveZipFiles()),
    onCancel: () => dispatch(closeZipConflictDialog()),
    onAllFilesActionChange: (value: string) => dispatch(allFilesActionChange(value)),
    zipFileActionChange: (value: string) => dispatch(zipFileActionChange(value)),

  }
}

const ZipConflictModalContainer = connect(mapState, mapDispatch)(ZipConflictModal)

export default ZipConflictModalContainer
