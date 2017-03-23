//@flow

import React from 'react'

import Button from '@mulesoft/anypoint-components/lib/Button'
import Modal from '@mulesoft/anypoint-components/lib/Modal'
import ModalHeader from '@mulesoft/anypoint-components/lib/ModalHeader'
import ModalBody from '@mulesoft/anypoint-components/lib/ModalBody'
import ModalFooter from '@mulesoft/anypoint-components/lib/ModalFooter'
import Select from '@mulesoft/anypoint-components/lib/Select'
import TextField from '@mulesoft/anypoint-components/lib/TextField'
import FileUploader from '@mulesoft/anypoint-components/lib/FileUploader'
import Popover from '@mulesoft/anypoint-components/lib/Popover'
import Toast from '@mulesoft/anypoint-components/lib/Toast'

import Icon from '../../svgicon/SvgIcon'
import importTypes from './importTypes.json'
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
  onCloseError: () => void,
  fileToImport: any,
  showModal: Boolean,
  isImporting: Boolean,
  error: string
}

class ImportModal extends React.Component {
  props: Props

  getType() {
    const selectValue = this.props.selectValue
    return importTypes.find(v => v.value === selectValue)
  }

  handleSubmit() {
    const fileType = this.getType()
    if (fileType.url) this.handlerUrlSubmit(fileType.type)
    else this.handlerFileSubmit(fileType.type)
  }

  handlerUrlSubmit(type: string) {
    if (this.props.url)
      this.props.onSubmitWithUrl(this.props.url, type)
  }

  handlerFileSubmit(type: string) {
    if (this.props.fileToImport)
      this.props.onSubmitWithFile(this.props.fileToImport, type)
  }

  handleUrlChange(event: any) {
    this.props.onUrlChange(event.value)
  }

  getPopoverContent() {
    return (
      <div className="Popover-in-modal">
        {this.getType().info}
      </div>
    )
  }

  render() {
    const {
      onCancel, onImportTypeChange, onFileUpload, onCloseError,
      showModal, selectValue, url, isImporting, fileToImport, error
    } = this.props

    return showModal ? (
      <Modal className="import-modal"
             onCancel={onCancel}
             onEsc={onCancel}
             onEnter={this.handleSubmit.bind(this)}
             onClickOverlay={onCancel}
             testId="Import-Modal">

        <ModalHeader>
          <h1>Import</h1>
        </ModalHeader>
        {error.length > 0 ?
          <div className="error-zone">
            <Toast className="import-error" title={error} kind="error" onClose={onCloseError} testId="Import-Error"/>
          </div> : null}
        <ModalBody>
          <div className="input-type">
            <Select name="import-type"
                    options={importTypes}
                    value={selectValue}
                    onChange={onImportTypeChange}
                    clearable={false}
                    testId="Import-Select"/>
            <Popover className="info-small-icon"
                     content={this.getPopoverContent()}
                     triggerOn={['hover']}
                     anchorPosition="br"
                     testId="Import-Popover">
              <div>
                <Icon name="info-small" size={19} fill="rgb(124, 125, 126)" />
              </div>
            </Popover>
          </div>
          {this.getType().url ?
            <TextField className="import-url" value={url} type="url" placeholder="Url..." testId="Import-Input-URL"
                       onChange={this.handleUrlChange.bind(this)} autoFocus/> :
            <FileUploader id="fileUploader"
                          onChange={onFileUpload}
                          className="import-file"
                          required={true}
                          value={fileToImport}
                          testId="Import-File-Uploader"/>
          }
        </ModalBody>

        <ModalFooter>
          <Button kind="tertiary" onClick={onCancel} noFill testId="Import-Cancel-Button">Cancel</Button>
          <Button kind="primary"
                  onClick={this.handleSubmit.bind(this)}
                  isLoading={isImporting}
                  testId="Import-Submit-Button">Import</Button>
        </ModalFooter>

      </Modal>
    ) : null
  }
}

export default ImportModal
