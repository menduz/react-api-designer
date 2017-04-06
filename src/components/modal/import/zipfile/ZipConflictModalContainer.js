//@flow

import {connect} from 'react-redux'

import ZipConflictModal from './ZipConflictModal'

import {getShowZipConflictModal, getAllFilesAction, getFileToImport, getFileNameToImport, getFileType, getZipFiles, getZipFileAction,
  isImporting, getZipWithDependencies
} from '../ImportSelectors'
import {saveZipFiles, closeZipConflictDialog, allFilesActionChange, zipFileActionChange, zipFileOverrideAction} from '../ImportActions'
import {isSaving} from "../../../../repository-redux/selectors";

const mapState = (rootState) => {
  return {
    showZipConflictModal: getShowZipConflictModal(rootState),
    allFilesAction: getAllFilesAction(rootState),
    fileToImport: getFileToImport(rootState),
    fileNameToImport: getFileNameToImport(rootState),
    fileType: getFileType(rootState),
    zipFiles: getZipFiles(rootState),
    zipFileAction: getZipFileAction(rootState),
    isImporting: isImporting(rootState),
    isSaving: isSaving(rootState),
    zipWithDependencies: getZipWithDependencies(rootState)
  }
}

const mapDispatch = (dispatch) => {
  return {
    submit: (zipWithDependencies) => dispatch(saveZipFiles(zipWithDependencies)),
    onCancel: () => dispatch(closeZipConflictDialog()),
    onAllFilesActionChange: (value: string) => dispatch(allFilesActionChange(value)),
    zipFileActionChange: (value: string) => dispatch(zipFileActionChange(value)),
    zipFileOverrideAction: (filename:string, override:boolean)=> dispatch(zipFileOverrideAction(filename, override))
  }
}

const ZipConflictModalContainer = connect(mapState, mapDispatch)(ZipConflictModal)

export default ZipConflictModalContainer
