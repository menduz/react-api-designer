//@flow

import {connect} from 'react-redux'

import ImportModal from './ImportModal'

import {getShowModal, getSelectValue, isImporting, getFileToImport, getUrl} from './ImportSelectors'
import {closeImportDialog, changeType, changeUrl, uploadFile, importFileFromUrl, importFile} from './ImportActions'

const mapState = (rootState) => {
  return {
    selectValue: getSelectValue(rootState),
    showModal: getShowModal(rootState),
    fileToImport: getFileToImport(rootState),
    url: getUrl(rootState),
    isImporting: isImporting(rootState)
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
