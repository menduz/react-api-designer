// @flow

import React from 'react'
import Button from '@mulesoft/anypoint-components/lib/Button'
import Modal from '@mulesoft/anypoint-components/lib/Modal'
import ModalHeader from '@mulesoft/anypoint-components/lib/ModalHeader'
import ModalBody from '@mulesoft/anypoint-components/lib/ModalBody'
import ModalFooter from '@mulesoft/anypoint-components/lib/ModalFooter'
import Label from '@mulesoft/anypoint-components/lib/Label'
import TextField from '@mulesoft/anypoint-components/lib/TextField'
import './PublishApi.css'

class PublishApiModal extends React.Component {
  props: Props

  constructor(props: Props) {
    super(props)
  }

  handleSave() {
    this.props.onSubmit(this.props.name, this.props.version)
  }

  handleNameChange(event: any) {
    if (this.props.onNameChange)
      this.props.onNameChange(event.value)
  }

  handleVersionChange(event: any) {
    if (this.props.onVersionChange)
      this.props.onVersionChange(event.value)
  }

  render() {
    const {name, version, isFetching, isFetched, link, error, onCancel} = this.props

    const canSubmit = this.canSubmit()

    let content
    if (isFetched) {
      content = PublishApiModal.link(link)
    } else {
      content = this.form(name, version, isFetching)
    }

    return (
      <Modal testId="project-create-modal"
             onEsc={onCancel}
             onClickOverlay={onCancel}
             className="publish-api-modal">
        <ModalHeader>
          <h2>Publish Api</h2>
        </ModalHeader>
        <ModalBody>
          {content}
          <div className="error">
            <span>{error}</span>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button kind="tertiary" noFill onClick={onCancel}>Cancel</Button>
          {isFetched ? null :
            <Button kind="primary" disabled={isFetching || !canSubmit}
                    isLoading={isFetching} onClick={this.handleSave.bind(this)}>
              Publish
            </Button>
          }
        </ModalFooter>
      </Modal>
    )
  }

  form(name, version, isFetching) {
    return (
      <div>
        <div className="form-row">
          <Label>Name</Label>
          <TextField value={name}
                     placeholder="Name"
                     disabled={isFetching}
                     onChange={this.handleNameChange.bind(this)}
                     required/>
        </div>
        <div className="form-row">
          <Label>Version</Label>
          <TextField value={version}
                     placeholder="Version"
                     disabled={isFetching}
                     onChange={this.handleVersionChange.bind(this)}
                     required/>
        </div>
      </div>
    )
  }

  static link(link) {
    return (
      <div>
        <a href={link}>Link to the Api</a>
      </div>
    )
  }

  canSubmit() {
    return PublishApiModal.isNotEmpty(this.props.name)
      && PublishApiModal.isNotEmpty(this.props.version)
  }

  static isNotEmpty(value: string) {
    return value && value.length > 0
  }
}

type Props = {
  name: string,
  version: string,

  error?: string,
  link?: string,
  isFetched?: Boolean,
  isFetching?: Boolean,

  onCancel: () => void,
  onSubmit: () => void,
  onNameChange?: (name: string) => void,
  onVersionChange?: (version: string) => void
}

export default PublishApiModal