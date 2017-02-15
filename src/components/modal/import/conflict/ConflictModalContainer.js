//@flow

import {connect} from 'react-redux'

import ConflictModal from './ConflictModal'

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

const ConflictModalContainer = connect(mapState, mapDispatch)(ConflictModal)

export default ConflictModalContainer
