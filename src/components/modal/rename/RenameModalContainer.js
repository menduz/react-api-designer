//@flow

import {connect} from 'react-redux'

import RenameModal from './RenameModal'
import {getShowModal, getNewName, getPath} from './RenameSelectors'
import {changeName, closeRenameDialog, renameWith} from './RenameActions'

const mapState = (rootState) => {
  return {
    newName: getNewName(rootState),
    path: getPath(rootState),
    showModal: getShowModal(rootState)
  }
}

const mapDispatch = (dispatch) => {
  return {
    onSubmit: (path: string, newName: string) => dispatch(renameWith(path, newName)),
    onCancel: () => dispatch(closeRenameDialog()),
    onNameChange: (name: string) => dispatch(changeName(name))
  }
}

export default connect(mapState, mapDispatch)(RenameModal)
