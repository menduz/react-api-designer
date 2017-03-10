//@flow

import {connect} from 'react-redux'

import ConflictModal from './ConflictModal'

import {getFileToImport, getShowConflictModal, getFileNameToImport, getFileType} from '../ImportSelectors'
import {saveFile, closeConflictDialog} from '../ImportActions'

const mapState = (rootState) => {
  return {
    showConflictModal: getShowConflictModal(rootState),
    fileToImport: getFileToImport(rootState),
    fileNameToImport: getFileNameToImport(rootState),
    fileType: getFileType(rootState),
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
