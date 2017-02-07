//@flow

import React from 'react'

import Button from '@mulesoft/anypoint-components/lib/Button'
import Modal from '@mulesoft/anypoint-components/lib/Modal'
import ModalHeader from '@mulesoft/anypoint-components/lib/ModalHeader'
import ModalBody from '@mulesoft/anypoint-components/lib/ModalBody'
import ModalFooter from '@mulesoft/anypoint-components/lib/ModalFooter'
import Select from '@mulesoft/anypoint-components/lib/Select'
import TextField from '@mulesoft/anypoint-components/lib/TextField'
import Popover from '@mulesoft/anypoint-components/lib/Popover'
import Icon from '@mulesoft/anypoint-icons/lib/Icon'

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

  getType() {
    const selectValue = this.props.selectValue;
    return ImportModal.IMPORT_TYPES.find(v => v.value === selectValue)
  }

  handleSubmit() {
    const fileType = this.getType().type
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

    if (showModal) {
      return (
        <Modal className="import-modal"
               onCancel={onCancel}
               onSubmit={this.handleSubmit.bind(this)}
               onEsc={onCancel}
               onEnter={this.handleSubmit.bind(this)}
               onClickOverlay={onCancel}>

          <ModalHeader>
            <h2>Import</h2>
          </ModalHeader>

          <ModalBody>
            <div className="input-type">
              <Select name="import-type"
                      options={ImportModal.IMPORT_TYPES}
                      value={selectValue}
                      onChange={onImportTypeChange}
                      clearable={false}
              />
              <Popover className="info-small-icon" content={this.getPopoverContent()} triggerOn={['hover']}
                       anchorPosition="br">
                <Icon name="info-small" size={19} fill={"rgb(124, 125, 126)"}/>
              </Popover>
            </div>
            {selectValue === 'RAML-file' || selectValue === 'OAS-file' ?
              <input className="import-file" type="file" onChange={onFileUpload}/> :
              <TextField className="import-url"
                         value={url}
                         type="url"
                         placeholder="Url..."
                         onChange={this.handleUrlChange.bind(this)}
                         autoFocus/>
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

  getPopoverContent() {
    return (
      <div className="Popover-in-modal">
        {this.getType().info}
      </div>
    )
  }

  static IMPORT_TYPES = [
    {
      value: 'RAML-file',
      label: 'RAML file',
      type: 'RAML10',
      info: 'Support single or zip files.'
    },
    {
      value: 'RAML-url',
      label: 'RAML url',
      type: 'RAML10',
      info: 'Note: currently it does not import includes.'
    },
    {
      value: 'OAS-file',
      label: 'OAS file',
      type: 'SWAGGER',
      info: 'Support single or zip files. Note: currently supports OAS (Swagger) v2.0.'
    },
    {
      value: 'OAS-url',
      label: 'OAS url',
      type: 'SWAGGER',
      info: 'Note: currently supports OAS (Swagger) v2.0.'
    }
  ];
}

export default ImportModal
