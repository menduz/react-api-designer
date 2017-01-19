//@flow

import React from 'react'
import {connect} from 'react-redux'

import type {State} from './NewFolderModel'
import NewFolderModal from './NewFolderModal'
import {getAll} from './NewFolderSelectors'
import {changeName, createFolder, closeNewFolderDialog} from './NewFolderActions'

type ContainerProps = {
  folderName: string
}

const mapState = (rootState) => {
  const state: State = getAll(rootState)
  return {
    showNewFolderModal: state.showNewFolderModal,
    folderName: state.folderName
  }
}

const mapDispatch = (dispatch, props: ContainerProps) => {
  return {
    onSubmit: () => {
      dispatch(createFolder(props.folderName))
      dispatch(closeNewFolderDialog())
    },
    onCancel: () => dispatch(closeNewFolderDialog()),
    onNameChange: (name: string) => dispatch(changeName(name))
  }
}

const NewFolderModalContainer = connect(mapState, mapDispatch)(NewFolderModal)

NewFolderModalContainer.PropTypes = {
  folderName: React.PropTypes.string
}

export default NewFolderModalContainer
