//@flow

import {connect} from 'react-redux'

import ImportModal from './ConflictModal'

import type {State} from '../ImportModel'

import {getAll} from '../ImportSelectors'
import {saveFile, closeConflictDialog} from '../ImportActions'

const mapState = (rootState) => {
  const state: State = getAll(rootState)
  return {
    showConflictModal: state.showConflictModal,
    fileToImport: state.fileToImport,
    fileNameToImport: state.fileNameToImport,
    fileType: state.fileType,
  }
}

const mapDispatch = (dispatch) => {
  return {
    onSubmit: () => dispatch(saveFile()),
    onCancel: () => dispatch(closeConflictDialog()),
  }
}

const ImportModalContainer = connect(mapState, mapDispatch)(ImportModal)

export default ImportModalContainer
