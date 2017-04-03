//@flow

import React from 'react'
import {Modal, TextField} from '../../MulesoftComponents'
import Path from '../../../repository/Path'

export type Props = {
  newName: ?string,
  path: Path,
  showModal: boolean,
  onSubmit: (path: Path, newName: string) => void,
  onCancel: () => void,
  onNameChange: (name: string) => void
}

class RenameModal extends React.Component {
  props: Props

  constructor(props: Props) { super(props) }

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
    const name = path.last()

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
