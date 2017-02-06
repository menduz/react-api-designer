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
    const filter = files.filter(f => {return f.conflict})
    const margin = { marginBottom: 20 };

    if (filter.length > 0) {
      return filter.map((file) => (
        //<Label>{file.filename + " " + file.override}</Label>
        <div style={margin} key={file.filename}>
          <Checkbox
            name={file.filename}
            label={file.filename}
            onChange={this.onCheckFileChange.bind(this, file.filename)}
            checked={file.override}
          />
        </div>
      ));
    }
    else return [];
  }

  render() {
    const {
      onSubmit,
      onCancel,
      showZipConflictModal,
      fileNameToImport,
      zipFiles,
    } = this.props

    const files = this.renderZipFiles(zipFiles);

    if (showZipConflictModal) {
      return (
        <Modal className="conflict-modal"
               onCancel={onCancel}
               onSubmit={onSubmit}
               onEsc={onCancel}
               onEnter={onSubmit}
               onClickOverlay={onCancel}>

          <ModalHeader>
            <h2>Replace</h2>
            <h3><bold>{fileNameToImport}</bold> contains files that are already in your project</h3>
          </ModalHeader>
          <ModalBody>
            <div>
              {files}
            </div>
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


export default ZipConflictModal
