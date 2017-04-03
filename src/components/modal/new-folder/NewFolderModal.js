//@flow

import React from 'react'

import {Modal, TextField} from '../../MulesoftComponents'

import {Path} from '../../../repository'

type Props = {
  folderName: string,
  showModal: Boolean,
  path: ?Path,
  onSubmit: () => void,
  onCancel: () => void,
  onNameChange: (name: string) => void
}

class NewFolderModal extends React.Component {
  props: Props

  handleSubmit() {
    const {folderName, path} = this.props

    if (folderName) this.props.onSubmit(folderName, path)
  }

  onNameChange(event: any) {
    this.props.onNameChange(event.value)
  }

  render() {
    const {folderName, onCancel, showModal} = this.props

    return showModal ? (
      <Modal className="new-folder"
             title="Add new folder"
             onCancel={onCancel}
             onSubmit={this.handleSubmit.bind(this)}
             onEsc={onCancel}
             onClickOverlay={onCancel}
             testId="New-Folder-Modal">
        <TextField value={folderName}
                   placeholder="Name..."
                   onChange={this.onNameChange.bind(this)}
                   autoFocus
                   testId="New-Folder-Input-Name"/>
      </Modal>
    ) : null
  }
}

export default NewFolderModal
