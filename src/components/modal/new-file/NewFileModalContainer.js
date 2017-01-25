//@flow

import React from 'react'
import {connect} from 'react-redux'

import type {State} from './NewFileModel'
import NewFileModal from './NewFileModal'
import {getAll} from './NewFileSelectors'
import {changeFileType, changeName, closeNewFileDialog} from './NewFileActions'
import {addFile} from "../../tree/actions";

const mapState = (rootState) => {
  const state : State = getAll(rootState)
  return {
    fileName: state.fileName,
    fileType: state.fileType,
    showModal: state.showModal
  }
}

const mapDispatch = (dispatch) => {
  return {
    onSubmit: (name: string, fileType: string) => {
      dispatch(addFile(name, fileType))
      dispatch(closeNewFileDialog())
    },
    onCancel: () => dispatch(closeNewFileDialog()),
    onFileTypeChange: (type: string) => dispatch(changeFileType(type)),
    onNameChange: (name: string) => dispatch(changeName(name))
  }
}

const NewFileModalContainer = connect(mapState, mapDispatch)(NewFileModal)

NewFileModalContainer.PropTypes = {
  fileName: React.PropTypes.string,
  fileType: React.PropTypes.string
}

export default NewFileModalContainer
