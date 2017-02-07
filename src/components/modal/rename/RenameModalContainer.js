//@flow

import {connect} from 'react-redux'

import type {State} from './RenameModel'

import RenameModal from './RenameModal'
import {getAll} from './RenameSelectors'
import {changeName, closeRenameDialog, renameWith} from './RenameActions'

const mapState = (rootState) => {
  const state: State = getAll(rootState)
  return {
    newName: state.newName,
    oldName: state.oldName,
    showModal: state.showModal
  }
}

const mapDispatch = (dispatch) => {
  return {
    onSubmit: (oldName: string, newName: string) => dispatch(renameWith(oldName, newName)),
    onCancel: () => dispatch(closeRenameDialog()),
    onNameChange: (name: string) => dispatch(changeName(name))
  }
}

export default connect(mapState, mapDispatch)(RenameModal)
