//@flow

import React from 'react'

import Modal from '@mulesoft/anypoint-components/lib/Modal'
import Select from '@mulesoft/anypoint-components/lib/Select'
import TextField from '@mulesoft/anypoint-components/lib/TextField'

import './NewFile.css'

type Props = {
  fileName: string,
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

  render() {
    const {
      fileName,
      onSubmit,
      onCancel,
      onFileTypeChange,
      showModal
    } = this.props

    var fileTypes = [
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
               onSubmit={onSubmit}
               onEsc={onCancel}
               onClickOverlay={onCancel}
        >
          <Select name="selected-file-type"
                  options={fileTypes}
                  value="RAML08"
                  onChange={onFileTypeChange}
          />
          <TextField className="new-file-name"
                     value={fileName}
                     placeholder="File name..."
                     onChange={this.onNameChange.bind(this)}
          />
        </Modal>
      )
    }
    return null
  }
}

export default NewFolderModal
