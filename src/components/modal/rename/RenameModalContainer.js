//@flow

import {connect} from 'react-redux'

import RenameModal from './RenameModal'
import {getShowModal, getNewName, getPath} from './RenameSelectors'
import {changeName, closeRenameDialog, renameWith} from './RenameActions'

import type {Props} from './RenameModal'
import type {Dispatch} from '../../../types'
import Path from '../../../repository/Path'

const mapState = (rootState: any): $Shape<Props> => {
  return {
    newName: getNewName(rootState),
    path: getPath(rootState),
    showModal: getShowModal(rootState)
  }
}

const mapDispatch = (dispatch: Dispatch): $Shape<Props> => {
  return {
    onSubmit: (path: Path, newName: string) => dispatch(renameWith(path, newName)),
    onCancel: () => dispatch(closeRenameDialog()),
    onNameChange: (name: string) => dispatch(changeName(name))
  }
}

export default connect(mapState, mapDispatch)(RenameModal)
