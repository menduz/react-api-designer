import React from 'react'

import Button from '@mulesoft/anypoint-components/lib/Button'
import Modal from '@mulesoft/anypoint-components/lib/Modal'
import ModalHeader from '@mulesoft/anypoint-components/lib/ModalHeader'
import ModalBody from '@mulesoft/anypoint-components/lib/ModalBody'
import ModalFooter from '@mulesoft/anypoint-components/lib/ModalFooter'
import Label from '@mulesoft/anypoint-components/lib/Label'

import './Conflict.css'

type Props = {
  selectValue: string,
  onSubmit: () => void,
  onCancel: () => void,
  showConflictModal: Boolean,
  isImporting: Boolean,
  fileNameToImport: string
}

class ConflictModal extends React.Component {
  props: Props

  render() {
    const {onSubmit, onCancel, showConflictModal, fileNameToImport} = this.props

    return showConflictModal ? (
      <Modal className="conflict-modal"
             onCancel={onCancel}
             onSubmit={onSubmit}
             onEsc={onCancel}
             onEnter={onSubmit}
             onClickOverlay={onCancel}
             testId="Conflict-Modal">

        <ModalHeader>
          <h1>File exists</h1>
        </ModalHeader>
        <ModalBody>
          <Label testId="Conflict-Description">{fileNameToImport} exists, do you want to replace it?</Label>
        </ModalBody>

        <ModalFooter>
          <Button kind="tertiary" onClick={onCancel} noFill testId="Conflict-Cancel-Button">Cancel</Button>
          <Button kind="primary" onClick={onSubmit} testId="Conflict-Submit-Button">Replace</Button>
        </ModalFooter>

      </Modal>
    ) : null
  }
}


export default ConflictModal
