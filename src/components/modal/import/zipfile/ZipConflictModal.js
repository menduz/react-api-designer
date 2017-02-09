//@flow

import React from 'react'

import Button from '@mulesoft/anypoint-components/lib/Button'
import Modal from '@mulesoft/anypoint-components/lib/Modal'
import ModalHeader from '@mulesoft/anypoint-components/lib/ModalHeader'
import ModalBody from '@mulesoft/anypoint-components/lib/ModalBody'
import ModalFooter from '@mulesoft/anypoint-components/lib/ModalFooter'
import Checkbox from '@mulesoft/anypoint-components/lib/Checkbox'


import './ZipConflict.css'

type Props = {
  selectValue: string,
  onSubmit: () => void,
  onCancel: () => void,
  showConflictModal: Boolean,
  isImporting: Boolean,
  fileNameToImport: string,
  zipFileOverrideAction: (filename:string, override:Boolean) => void,
  zipFiles: Array,
  zipFileAction:string
}

class ZipConflictModal extends React.Component {
  props: Props

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      container: null
    };
  }

  onCheckFileChange(filename, e) {
    //e.event.preventDefault();
    this.props.zipFileOverrideAction(filename, e.value)
  }

  renderZipFiles(files) {
    return files.map((file) => (
      //<Label>{file.filename + " " + file.override}</Label>
      <div style={{ marginBottom: 20 }} key={file.filename}>
        <Checkbox
          name={file.filename}
          label={file.filename}
          onChange={this.onCheckFileChange.bind(this, file.filename)}
          checked={file.override}
        />
      </div>
    ));
  }

  render() {
    const {
      onSubmit,
      onCancel,
      showZipConflictModal,
      fileNameToImport,
      zipFiles,
    } = this.props

    if (!showZipConflictModal) return null

    const files = zipFiles.filter(f => f.conflict)
    const count = files.reduce(((count, f) => (f.override ? 1 : 0) + count), 0)

    return (
      <Modal className="zip-conflict-modal"
             onCancel={onCancel}
             onSubmit={onSubmit}
             onEsc={onCancel}
             onEnter={onSubmit}
             onClickOverlay={onCancel}>

        <ModalHeader>
          <h2>Replace</h2>
          <small>{fileNameToImport} contains files that are already in your project</small>
        </ModalHeader>
        <ModalBody>
          <div>
            {files.length > 0 ? this.renderZipFiles(files) : null}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button kind="tertiary" onClick={onCancel} noFill>Cancel</Button>
          <Button kind="primary" onClick={onSubmit}>Replace {files.length == 1 ? 'file' : count + ' files'}</Button>
        </ModalFooter>
      </Modal>
    )
  }

}


export default ZipConflictModal
