//@flow

import React from 'react'

import Modal from '@mulesoft/anypoint-components/lib/Modal'
import Select from '@mulesoft/anypoint-components/lib/Select'
import TextField from '@mulesoft/anypoint-components/lib/TextField'

import './NewFile.css'

type Props = {
  fileName: string,
  fileType: string,
  onSubmit: () => void,
  onCancel: () => void,
  onFileTypeChange: () => void,
  onNameChange: () => void,
  showModal: Boolean
}

class NewFolderModal extends React.Component {
  props: Props

  constructor(props: Props) {
    super(props)
  }

  onNameChange(event: any) {
    this.props.onNameChange(event.value)
  }

  handleSubmit() {
      const type = this.props.fileType;
      const name = this.props.fileName;
      if (type && name)
        this.props.onSubmit(name, type)
  }

  render() {
    const {
      fileName,
      fileType,
      onCancel,
      onFileTypeChange,
      showModal
    } = this.props

    const fileTypes = [
      {
        value: 'RAML10',
        label: 'RAML 1.0 API Spec'
      },
      {
        value: 'RAML08',
        label: 'RAML 0.8 API Spec'
      }
    ]

    if (showModal) {
      return (
        <Modal className="new-file"
               title="Add new API Spec file"
               onCancel={onCancel}
               onSubmit={this.handleSubmit.bind(this)}
               onEsc={onCancel}
               onClickOverlay={onCancel}
        >
          <Select name="selected-file-type"
                  options={fileTypes}
                  value={fileType}
                  onChange={onFileTypeChange}
                  clearable={false}
          />
          <TextField className="new-file-name"
                     value={fileName}
                     placeholder="File name..."
                     onChange={this.onNameChange.bind(this)}
                     autoFocus
          />
        </Modal>
      )
    }
    return null
  }
}

export default NewFolderModal
