//@flow

import {connect} from 'react-redux'

import NewFolderModal from './NewFolderModal'

import type {State} from './NewFolderModel'
import {getAll} from './NewFolderSelectors'
import {changeName, closeNewFolderDialog} from './NewFolderActions'
import {addDirectory} from "../../tree/actions"
import {Path} from '../../../repository'

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
      const currentPath = path ? path : Path.emptyPath(true)
      dispatch(addDirectory(name, currentPath))
      dispatch(closeNewFolderDialog())
    },
    onCancel: () => dispatch(closeNewFolderDialog()),
    onNameChange: (name: string) => dispatch(changeName(name))
  }
}

export default connect(mapState, mapDispatch)(NewFolderModal)
