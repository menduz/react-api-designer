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
  submit: (zipWithDependencies:boolean) => void,
  onCancel: () => void,
  showConflictModal: Boolean,
  isImporting: Boolean,
  fileNameToImport: string,
  zipFileOverrideAction: (filename:string, override:Boolean) => void,
  zipWithDependencies:boolean,
  zipFiles: [],
  zipFileAction:string,
  isImporting:boolean,
  isSaving:boolean,
}

class ZipConflictModal extends React.Component {
  props: Props

  constructor(props: Props) {
    super(props)

    this.state = {
      open: false,
      container: null
    }
  }

  onCheckFileChange(filename, e) {
    //e.event.preventDefault()
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
    ))
  }

  handleSubmit() {
    return this.props.submit(this.props.zipWithDependencies)
  }

  render() {
    const {onCancel, showZipConflictModal, fileNameToImport, zipFiles,
      isImporting, isSaving, zipWithDependencies} = this.props

    if (!showZipConflictModal) return null

    const files = zipFiles.filter(f => f.conflict)
    const count = files.reduce(((count, f) => (f.override ? 1 : 0) + count), 0)

    return (
      <Modal className="zip-conflict-modal"
             onCancel={onCancel}
             onSubmit={this.handleSubmit.bind(this)}
             onEsc={onCancel}
             onEnter={this.handleSubmit.bind(this)}
             onClickOverlay={onCancel}
             testId="Zip-Conflict-Modal">

        <ModalHeader className="zip-modal-header">
          <h1>Replace</h1>
          <small data-test-id="Zip-Header">{fileNameToImport} contains files that are already in your project</small>
        </ModalHeader>
        <ModalBody>
          <div data-test-id="Zip-Body-Content">
            {files.length > 0 ? this.renderZipFiles(files) : null}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button kind="tertiary" onClick={onCancel} noFill testId="Zip-Cancel-Button">Cancel</Button>
          <Button kind="primary"
                  onClick={this.handleSubmit.bind(this)}
                  disabled={count === 0}
                  isLoading={isImporting}
                  testId="Zip-Submit-Button">
            {isImporting ? isSaving ?  'Saving...' : 'Replacing...' : `Replace ${count === 1 ? 'file' : count + ' files'}`}
          </Button>
        </ModalFooter>
      </Modal>
    )
  }

}


export default ZipConflictModal
