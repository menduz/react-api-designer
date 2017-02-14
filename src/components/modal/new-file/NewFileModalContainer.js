//@flow

import React from 'react'
import {connect} from 'react-redux'

import type {State, FileType} from './NewFileModel'
import NewFileModal from './NewFileModal'
import {getAll} from './NewFileSelectors'
import {changeFileType, changeName, closeNewFileDialog, changeFragmentType, add} from './NewFileActions'
import {Path} from '../../../repository'

const mapState = (rootState) => {
  const state : State = getAll(rootState)
  return {
    fileName: state.fileName,
    fileType: state.fileType,
    fragmentType: state.fragmentType,
    showModal: state.showModal,
    path: state.path
  }
}

const mapDispatch = (dispatch) => {
  return {
    onSubmit: (name: string, fileType:? string, path: ?Path) => {
      var currentPath = path ? path : Path.emptyPath(true)
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
