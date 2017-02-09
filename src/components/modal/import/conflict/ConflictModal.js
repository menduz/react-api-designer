//@flow

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
    const {
      onSubmit,
      onCancel,
      showConflictModal,
      fileNameToImport
    } = this.props

    if (showConflictModal) {
      return (
        <Modal className="conflict-modal"
               onCancel={onCancel}
               onSubmit={onSubmit}
               onEsc={onCancel}
               onEnter={onSubmit}
               onClickOverlay={onCancel}
               testId="Conflict-Modal">

          <ModalHeader>
            <h2>File exists</h2>
          </ModalHeader>
          <ModalBody>
            <Label>{fileNameToImport} exists, do you want to replace it?</Label>
          </ModalBody>

          <ModalFooter>
            <Button kind="tertiary" onClick={onCancel} noFill>Cancel</Button>
            <Button kind="primary" onClick={onSubmit}>Replace</Button>
          </ModalFooter>

        </Modal>
      )
    }
    return null
  }
}


export default ConflictModal
