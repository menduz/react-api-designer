//@flow

import React from 'react'
import {connect} from 'react-redux'

import type {FileType} from './NewFileModel'
import NewFileModal from './NewFileModal'
import {getFileName, getFileTypeOptions, getFileType, getFragmentType, getShowModal, getPath} from './NewFileSelectors'
import {changeFileType, changeName, closeNewFileDialog, changeFragmentType, add} from './NewFileActions'
import {Path} from '../../../repository'

const mapState = (rootState) => {
  return {
    fileName: getFileName(rootState),
    fileTypeOptions: getFileTypeOptions(rootState),
    fileType: getFileType(rootState),
    fragmentType: getFragmentType(rootState),
    showModal: getShowModal(rootState),
    path: getPath(rootState)
  }
}

const mapDispatch = (dispatch) => {
  return {
    onSubmit: (name: string, fileType: ?string, path: ?Path) => {
      const currentPath = path ? path : Path.emptyPath(true)
      dispatch(add(name, fileType, currentPath))
    },
    onCancel: () => dispatch(closeNewFileDialog()),
    onFileTypeChange: (type: FileType) => dispatch(changeFileType(type)),
    onFragmentTypeChange: (type: FileType) => dispatch(changeFragmentType(type)),
    onNameChange: (name: string) => dispatch(changeName(name))
  }
}

const NewFileModalContainer = connect(mapState, mapDispatch)(NewFileModal)

NewFileModalContainer.PropTypes = {
  fileName: React.PropTypes.string,
  fileType: React.PropTypes.object
}

export default NewFileModalContainer
