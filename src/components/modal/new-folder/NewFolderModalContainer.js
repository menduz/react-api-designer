//@flow

import {connect} from 'react-redux'

import type {State} from './NewFolderModel'
import NewFolderModal from './NewFolderModal'
import {getAll} from './NewFolderSelectors'
import {changeName, closeNewFolderDialog} from './NewFolderActions'
import {addDirectory} from "../../tree/actions";

const mapState = (rootState) => {
  const state: State = getAll(rootState)
  return {
    showModal: state.showModal,
    folderName: state.folderName,
    path: state.path
  }
}

const mapDispatch = (dispatch) => {
  return {
    onSubmit: (name, path) => {
      dispatch(addDirectory(name, path))
      dispatch(closeNewFolderDialog())
    },
    onCancel: () => dispatch(closeNewFolderDialog()),
    onNameChange: (name: string) => dispatch(changeName(name))
  }
}

export default connect(mapState, mapDispatch)(NewFolderModal)
