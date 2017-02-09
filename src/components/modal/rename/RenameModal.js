//@flow

import React from 'react'

import Modal from '@mulesoft/anypoint-components/lib/Modal'
import TextField from '@mulesoft/anypoint-components/lib/TextField'

type Props = {
  newName?: string,
  oldName: string,
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
    const {oldName, newName} = this.props

    if (oldName && newName)
      this.props.onSubmit(oldName, newName)
  }

  render() {
    const {
      oldName,
      newName,
      onCancel,
      showModal
    } = this.props

    if (!showModal) return null

    const name = oldName.substr(oldName.lastIndexOf('/') + 1, oldName.length)

    return (
      <Modal className="rename"
             title="Rename"
             onCancel={onCancel}
             onSubmit={this.handleSubmit.bind(this)}
             onEsc={onCancel}
             onClickOverlay={onCancel}>

        <TextField className="new-name"
                   value={newName ? newName : name}
                   onChange={this.onNameChange.bind(this)}
                   autoFocus/>
      </Modal>
    )
  }
}

export default RenameModal
