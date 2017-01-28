//@flow

import React from 'react'

import Modal from '@mulesoft/anypoint-components/lib/Modal'
import Select from '@mulesoft/anypoint-components/lib/Select'
import TextField from '@mulesoft/anypoint-components/lib/TextField'

import './NewFile.css'

type Props = {
  fileName: string,
  fileType: string,
  fragmentType: string,
  onSubmit: () => void,
  onCancel: () => void,
  onFileTypeChange: () => void,
  onFragmentTypeChange: () => void,
  onNameChange: () => void,
  showModal: Boolean
}

class NewFolderModal extends React.Component {
  props: Props

  onNameChange(event: any) {
    this.props.onNameChange(event.value)
  }

  handleSubmit() {
    const type = this.props.fileType === 'RAML10' ? this.props.fragmentType : this.props.fileType
    const name = this.props.fileName
    if (type && name)
      this.props.onSubmit(name, type)
  }

  render() {
    const {
      fileName,
      fileType,
      fragmentType,
      onCancel,
      onFileTypeChange,
      onFragmentTypeChange,
      showModal
    } = this.props

    const fileTypes = [
      {value: 'RAML10', label: 'RAML 1.0'},
      {value: 'RAML08', label: 'RAML 0.8'},
      {value: 'OTHER', label: 'Other'}
    ]

    const fragments = [
      {value: 'RAML10', label: 'Spec'},
      {value: 'TRAIT', label: 'Trait'},
      {value: 'RESOURCE-TYPE', label: 'Resource Type'},
      {value: 'LIBRARY', label: 'Library'},
      {value: 'OVERLAY', label: 'Overlay'},
      {value: 'EXTENSION', label: 'Extension'},
      {value: 'DATA-TYPE', label: 'Type'},
      {value: 'DOCUMENTATION-ITEM', label: 'User Documentation'},
      {value: 'NAMED-EXAMPLE', label: 'Example'},
      {value: 'ANNOTATION-TYPE-DECLARATION', label: 'Annotation'},
      {value: 'SECURITY-SCHEME', label: 'Security Scheme'}
    ]

    if (showModal) {
      return (
        <Modal className="new-file"
               title="Add new file"
               onCancel={onCancel}
               onSubmit={this.handleSubmit.bind(this)}
               onEsc={onCancel}
               onClickOverlay={onCancel}
        >
          <Select className="selected-file-type"
                  options={fileTypes}
                  value={fileType}
                  onChange={onFileTypeChange}
                  clearable={false}
          />

          {fileType === 'RAML10' ?
            <Select className="selected-fragment"
                    options={fragments}
                    value={fragmentType}
                    onChange={onFragmentTypeChange}
                    clearable={false}
            /> : null}

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
