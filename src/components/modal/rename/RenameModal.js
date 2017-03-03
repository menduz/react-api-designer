//@flow

import React from 'react'

import Modal from '@mulesoft/anypoint-components/lib/Modal'
import TextField from '@mulesoft/anypoint-components/lib/TextField'

type Props = {
  newName?: string,
  path: string,
  showModal: boolean,
  onSubmit: (newName: string) => void,
  onCancel: () => void,
  onNameChange: (name: string) => void
}

class RenameModal extends React.Component {
  props: Props

  onNameChange(event: any) {
    this.props.onNameChange(event.value)
  }

  handleSubmit() {
    const {path, newName} = this.props

    if (path && newName)
      this.props.onSubmit(path, newName)
  }

  render() {
    const {path, newName, onCancel, showModal} = this.props
    const name = path ? path.substr(path.lastIndexOf('/') + 1, path.length) : ''

    return showModal ? (
      <Modal className="rename"
             title="Rename"
             onCancel={onCancel}
             onSubmit={this.handleSubmit.bind(this)}
             onEsc={onCancel}
             onClickOverlay={onCancel}
             testId="Rename-Modal">

        <TextField className="new-name"
                   value={newName ? newName : name}
                   onChange={this.onNameChange.bind(this)}
                   autoFocus
                   testId="Rename-Input"/>
      </Modal>
    ) : null
  }
}

export default RenameModal
