//@flow

import {connect} from 'react-redux'

import UnsavedModal from './UnsavedModal'
import {isShowModal, isSaving, getFinishAction} from './UnsavedSelectors'
import {saveChanges, cancelSave} from './UnsavedActions'

const mapState = (rootState) => {
  return {
    isSaving: isSaving(rootState),
    finishAction: getFinishAction(rootState),
    showModal: isShowModal(rootState)
  }
}

const mapDispatch = (dispatch) => {
  return {
    onSubmit: () => dispatch(saveChanges()),
    onCancel: () => dispatch(cancelSave())
  }
}

export default connect(mapState, mapDispatch)(UnsavedModal)
