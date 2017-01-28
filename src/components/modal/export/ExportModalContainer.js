//@flow

import React from 'react'
import {connect} from 'react-redux'

import ExportModal from './ExportModal'
import type {State} from './ExportModel'
import {getAll} from './ExportSelectors'
import {exportAll, closeExportDialog, changeType, changeName} from './ExportActions'

const mapState = (rootState) => {
  const state: State = getAll(rootState)
  return {
    exportName: state.exportName,
    type: state.type,
    showModal: state.showModal,
    showError: state.showError,
    isExporting: state.isExporting
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
