//@flow

import {connect} from 'react-redux'

import ExportModal from './ExportModal'
import {getExportName, getType, getShowModal, getShowError, isExporting} from './ExportSelectors'
import {exportAll, closeExportDialog, changeType, changeName} from './ExportActions'

const mapState = (rootState) => {
  return {
    exportName: getExportName(rootState),
    type: getType(rootState),
    showModal: getShowModal(rootState),
    showError: getShowError(rootState),
    isExporting: isExporting(rootState)
  }
}

const mapDispatch = (dispatch) => {
  return {
    onSubmit: (name: string, type: string) => dispatch(exportAll(name, type)),
    onCancel: () => dispatch(closeExportDialog()),
    onExportTypeChange: (type: string) => dispatch(changeType(type)),
    onNameChange: (name: string) => dispatch(changeName(name))
  }
}

const ExportModalContainer = connect(mapState, mapDispatch)(ExportModal)

export default ExportModalContainer
