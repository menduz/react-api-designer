//@flow

import React from 'react'
import {connect} from 'react-redux'

import type {State} from './NewFileModel'
import NewFileModal from './NewFileModal'
import {getAll} from './NewFileSelectors'
import {changeFileType, changeName, createFile, closeNewFileDialog} from './NewFileActions'

const mapState = (rootState) => {
  const state : State = getAll(rootState)
  return {
    fileName: state.fileName,
    fileType: state.fileType,
    showNewFolderModal: state.showNewFolderModal
  }
}

const mapDispatch = (dispatch, props: ContainerProps) => {
  return {
    onSubmit: () => {
      dispatch(createFile(props.fileName, props.fileType))
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

type ContainerProps = {
  fileName: string,
  fileType: string,
  showNewFolderModal: Boolean
}

export default NewFileModalContainer
