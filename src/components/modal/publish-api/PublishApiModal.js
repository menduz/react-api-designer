// @flow

import React from 'react'
import Button from '@mulesoft/anypoint-components/lib/Button'
import Modal from '@mulesoft/anypoint-components/lib/Modal'
import ModalHeader from '@mulesoft/anypoint-components/lib/ModalHeader'
import ModalBody from '@mulesoft/anypoint-components/lib/ModalBody'
import ModalFooter from '@mulesoft/anypoint-components/lib/ModalFooter'
import Label from '@mulesoft/anypoint-components/lib/Label'
import TextField from '@mulesoft/anypoint-components/lib/TextField'
import Pill from '@mulesoft/anypoint-components/lib/Pill'
import Pills from '@mulesoft/anypoint-components/lib/Pills'
import './PublishApi.css'

class PublishApiModal extends React.Component {
  props: Props

  constructor(props: Props) {
    super(props)
  }

  handleSave() {
    this.props.onSubmit(this.props.name, this.props.version, this.props.tags)
  }

  handleNameChange(event: any) {
    if (this.props.onNameChange)
      this.props.onNameChange(event.value)
  }

  handleVersionChange(event: any) {
    if (this.props.onVersionChange)
      this.props.onVersionChange(event.value)
  }

  handleTagChange(event: any) {
    this.props.onTagChange(event.value)
  }

  handleSaveTag() {
    this.props.onSubmitTag(this.props.tag)
  }

  render() {
    const {name, version, tag, tags, isFetching, isFetched, link, error, onCancel} = this.props

    const canSubmit = this.canSubmit()

    let content
    if (isFetched) {
      content = PublishApiModal.link(link)
    } else {
      content = this.form(name, version, tag, tags, isFetching)
    }

    return (
      <Modal testId="project-create-modal"
             onEsc={onCancel}
             onClickOverlay={onCancel}
             className="publish-api-modal">
        <ModalHeader>
          <h2>Publish API</h2>
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

  form(name, version, tag, tags, isFetching) {
    return (
      <div>
        <div className="form-row">
          <Label className="required">Name</Label>
          <TextField value={name}
                     placeholder="Name..."
                     disabled={isFetching}
                     onChange={this.handleNameChange.bind(this)}
                     required/>
        </div>
        <div className="form-row">
          <Label className="required">Version</Label>
          <TextField value={version}
                     placeholder="Version..."
                     disabled={isFetching}
                     onChange={this.handleVersionChange.bind(this)}
                     required/>
        </div>
        <div className="form-row">
          <Label>Tags</Label>
          <Pills>
            {tags ? tags.map(tag => (
              <Pill key={tag} onRemove={() => this.props.onTagRemove(tag)}>{tag}</Pill>
            )) : null}
          </Pills>
          <div className="tags">
            <TextField className="tag-name"
                       value={tag}
                       placeholder="Tag..."
                       disabled={isFetching}
                       onChange={this.handleTagChange.bind(this)}/>
            <Button className="save-tag-button"
                    kind="primary"
                    disabled={!tag}
                    onClick={this.handleSaveTag.bind(this)}
                    noFill>
              Add
            </Button>
          </div>
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
  tag?: string,
  tags: Array<string>,

  error?: string,
  link?: string,
  isFetched?: Boolean,
  isFetching?: Boolean,

  onCancel: () => void,
  onSubmit: () => void,
  onNameChange?: (name: string) => void,
  onVersionChange?: (version: string) => void,
  onTagChange: (tag: string) => void,
  onTagRemove: (tag: string) => void,
  onSubmitTag: (tag: string) => void
}

export default PublishApiModal