//@flow

import {connect} from 'react-redux'

import ImportModal from './ImportModal'

import type {State} from './ImportModel'

import {getAll} from './ImportSelectors'
import {closeImportDialog, changeType, changeUrl, uploadFile, importFileFromUrl, importFile} from './ImportActions'

const mapState = (rootState) => {
  const state: State = getAll(rootState)
  return {
    selectValue: state.selectValue,
    showModal: state.showModal,
    fileToImport: state.fileToImport,
    url: state.url,
    isImporting: state.isImporting
  }
}

const mapDispatch = (dispatch) => {
  return {
    onSubmitWithUrl: (url: string, fileType: string) => dispatch(importFileFromUrl(url, fileType)),
    onSubmitWithFile: (fileToImport: any, fileType: string) => dispatch(importFile(fileToImport, fileType)),
    onCancel: () => dispatch(closeImportDialog()),
    onImportTypeChange: (type: string) => dispatch(changeType(type)),
    onUrlChange: (url: string) => dispatch(changeUrl(url)),
    onFileUpload: (event: any) => dispatch(uploadFile(event))
  }
}

const ImportModalContainer = connect(mapState, mapDispatch)(ImportModal)

export default ImportModalContainer
