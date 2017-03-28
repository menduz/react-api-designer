//@flow

import React from 'react'
import Modal from '@mulesoft/anypoint-components/lib/Modal'
import ModalHeader from '@mulesoft/anypoint-components/lib/ModalHeader'
import ModalBody from '@mulesoft/anypoint-components/lib/ModalBody'
import ModalFooter from '@mulesoft/anypoint-components/lib/ModalFooter'
import Button from '@mulesoft/anypoint-components/lib/Button'

type Props = {
  showModal: boolean,
  isSaving: boolean,
  finishAction: string,
  onSubmit: () => void,
  onCancel: () => void
}

class UnsavedModal extends React.Component {
  props: Props

  render() {
    const {onSubmit, onCancel, showModal, isSaving, finishAction} = this.props

    return showModal ? (
      <Modal className="Unsaved-Modal"
             onCancel={onCancel}
             onSubmit={onSubmit}
             onEsc={onCancel}
             onClickOverlay={onCancel}
             testId="Unsaved-Warning-Modal">

        <ModalHeader>
          <h1>There are unsaved changes</h1>
        </ModalHeader>

        <ModalBody>
          Do you want to save this changes before {finishAction}?
        </ModalBody>

        <ModalFooter>
          <Button kind="tertiary" noFill onClick={onCancel} testId="Unsaved-Cancel-Button">Cancel</Button>
          <Button kind="primary" testId="Unsaved-Submit-Button"
                  isLoading={isSaving} onClick={onSubmit}>
            {isSaving? 'Saving...' : 'Save all'}
          </Button>
        </ModalFooter>
      </Modal>
    ) : null
  }
}

export default UnsavedModal
