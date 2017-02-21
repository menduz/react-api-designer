//@flow

import React from 'react'

import Button from '@mulesoft/anypoint-components/lib/Button'
import Modal from '@mulesoft/anypoint-components/lib/Modal'
import ModalBody from '@mulesoft/anypoint-components/lib/ModalBody'
import ModalHeader from '@mulesoft/anypoint-components/lib/ModalHeader'
import ModalFooter from '@mulesoft/anypoint-components/lib/ModalFooter'
import Select from '@mulesoft/anypoint-components/lib/Select'
import TextField from '@mulesoft/anypoint-components/lib/TextField'

import './Export.css'

type Props = {
  onSubmit: (name: string) => void,
  onCancel: () => void,
  onExportTypeChange: () => void,
  onNameChange: () => void,
  showModal: Boolean,
  showError: Boolean,
  isExporting: Boolean,
  type: string,
  exportName: string
}

class ExportModal extends React.Component {
  props: Props

  onNameChange(event: any) {
    this.props.onNameChange(event.value)
  }

  handleSubmit() {
    const {exportName, type} = this.props

    if (exportName && type)
      this.props.onSubmit(exportName, type)
  }

  render() {
    const {onCancel, onExportTypeChange, showModal, showError, isExporting, type, exportName} = this.props

    return showModal ? (
      <Modal className="export-modal"
             onEnter={this.handleSubmit.bind(this)}
             onEsc={onCancel}
             onClickOverlay={onCancel}
             testId="Export-Modal">

        <ModalHeader>
          <h2>Export</h2>
        </ModalHeader>

        <ModalBody>
          <Select name="selected-export-type"
                  options={ExportModal.EXPORT_TYPES}
                  value={type}
                  onChange={onExportTypeChange}
                  clearable={false}
                  testId="Export-Select"/>
          <TextField className="export-name"
                     value={exportName}
                     placeholder="Name..."
                     onChange={this.onNameChange.bind(this)}
                     autoFocus
                     testId="Export-Input-Name"/>
        </ModalBody>

        <ModalFooter>
          {showError ? <p>Failed export</p> : null}
          <Button kind="tertiary" onClick={onCancel} noFill testId="Export-Cancel-Button">Cancel</Button>
          <Button kind="primary"
                  onClick={this.handleSubmit.bind(this)}
                  isLoading={isExporting}
                  testId="Export-Submit-Button">Export</Button>
        </ModalFooter>

      </Modal>
    ) : null
  }

  static EXPORT_TYPES = [
    {
      value: 'zip',
      label: 'Project zip'
    },
    {
      value: 'json',
      label: 'OAS Json'
    },
    {
      value: 'yaml',
      label: 'OAS Yaml'
    }
  ]
}

export default ExportModal
