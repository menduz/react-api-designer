//@flow

import React from 'react'
import {connect} from 'react-redux'

import type {State} from './NewFileModel'
import NewFileModal from './NewFileModal'
import {getAll} from './NewFileSelectors'
import {changeFileType, changeName, closeNewFileDialog, changeFragmentType, add} from './NewFileActions'

const mapState = (rootState) => {
  const state : State = getAll(rootState)
  return {
    fileName: state.fileName,
    fileType: state.fileType,
    fragmentType: state.fragmentType,
    showModal: state.showModal
  }
}

const mapDispatch = (dispatch) => {
  return {
    onSubmit: (name: string, fileType: string) => dispatch(add(name, fileType)),
    onCancel: () => dispatch(closeNewFileDialog()),
    onFileTypeChange: (type: string) => dispatch(changeFileType(type)),
    onFragmentTypeChange: (type: string) => dispatch(changeFragmentType(type)),
    onNameChange: (name: string) => dispatch(changeName(name))
  }
}

const NewFileModalContainer = connect(mapState, mapDispatch)(NewFileModal)

NewFileModalContainer.PropTypes = {
  fileName: React.PropTypes.string,
  fileType: React.PropTypes.string
}

export default NewFileModalContainer
