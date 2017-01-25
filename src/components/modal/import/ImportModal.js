//@flow

import React from 'react'

import Button from '@mulesoft/anypoint-components/lib/Button'
import Modal from '@mulesoft/anypoint-components/lib/Modal'
import ModalHeader from '@mulesoft/anypoint-components/lib/ModalHeader'
import ModalBody from '@mulesoft/anypoint-components/lib/ModalBody'
import ModalFooter from '@mulesoft/anypoint-components/lib/ModalFooter'
import Select from '@mulesoft/anypoint-components/lib/Select'
import TextField from '@mulesoft/anypoint-components/lib/TextField'

import './Import.css'

type Props = {
  selectValue: string,
  url: string,
  onSubmitWithFile: (fileToImport: any, fileType: string) => void,
  onSubmitWithUrl: (url: string, fileType: string) => void,
  onCancel: () => void,
  onImportTypeChange: () => void,
  onUrlChange: () => void,
  onFileUpload: () => void,
  fileToImport: any,
  showModal: Boolean,
  isImporting: Boolean
}

class ImportModal extends React.Component {
  props: Props

  getType(): string {
    switch (this.props.selectValue) {
      case 'OAS-file':
      case 'OAS-url':
        return 'SWAGGER'
      case 'RAML-file':
      case 'RAML-url':
      default:
        return 'RAML10'
    }
  }

  handleSubmit() {
    var fileType = this.getType()
    if (this.props.fileToImport) {
      this.props.onSubmitWithFile(this.props.fileToImport, fileType)
    } else {
      this.props.onSubmitWithUrl(this.props.url, fileType)
    }
  }

  handleUrlChange(event: any) {
    this.props.onUrlChange(event.value)
  }

  render() {
    const {
      onCancel,
      onImportTypeChange,
      onFileUpload,
      showModal,
      selectValue,
      url,
      isImporting
    } = this.props

    var importTypes = [
      {
        value: 'RAML-file',
        label: 'RAML file'
      },
      {
        value: 'RAML-url',
        label: 'RAML url'
      },
      {
        value: 'OAS-file',
        label: 'OAS file'
      },
      {
        value: 'OAS-url',
        label: 'OAS url'
      }
    ]

    if (showModal) {
      return (
        <Modal className="import-modal"
               onCancel={onCancel}
               onSubmit={this.handleSubmit.bind(this)}
               onEsc={onCancel}
               onEnter={this.handleSubmit.bind(this)}
               onClickOverlay={onCancel}>

          <ModalHeader>
            <h2>Import file</h2>
          </ModalHeader>

          <ModalBody>
            <Select name="import-type"
                    options={importTypes}
                    value={selectValue}
                    onChange={onImportTypeChange}
                    clearable={false}/>
            {selectValue === 'RAML-file' || selectValue === 'OAS-file' ?
              <input className="import-file" type="file" onChange={onFileUpload}/> :
              <TextField className="import-url"
                         value={url}
                         placeholder="Url..."
                         onChange={this.handleUrlChange.bind(this)}
                         autoFocus
              />
            }
          </ModalBody>

          <ModalFooter>
            <Button kind="tertiary" onClick={onCancel} noFill>Cancel</Button>
            <Button kind="primary" onClick={this.handleSubmit.bind(this)} isLoading={isImporting}>Import</Button>
          </ModalFooter>

        </Modal>
      )
    }
    return null
  }
}

export default ImportModal
