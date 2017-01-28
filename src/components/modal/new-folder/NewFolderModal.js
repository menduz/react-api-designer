//@flow

import React from 'react'

import Modal from '@mulesoft/anypoint-components/lib/Modal'
import TextField from '@mulesoft/anypoint-components/lib/TextField'

type Props = {
  folderName: string,
  showModal: Boolean,
  onSubmit: () => void,
  onCancel: () => void,
  onNameChange: (name: string) => void
}

class NewFolderModal extends React.Component {
  props: Props

  handleSubmit() {
      const name = this.props.folderName;
      if (name)
          this.props.onSubmit(name)
  }

  onNameChange(event: any) {
    this.props.onNameChange(event.value)
  }

  render() {
    const {
      folderName,
      onCancel,
      showModal
    } = this.props

    if (showModal) {
      return (
        <Modal className="new-folder"
               title="Add a new folder"
               onCancel={onCancel}
               onSubmit={this.handleSubmit.bind(this)}
               onEsc={onCancel}
               onClickOverlay={onCancel}
        >
          <TextField value={folderName}
                     placeholder="Folder name..."
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
