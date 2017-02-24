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
import Checkbox from '@mulesoft/anypoint-components/lib/Checkbox'

import './PublishApi.css'

class PublishApiModal extends React.Component {
  props: Props

  handleSave() {
    const {publishToBothApis, publishToExchange} = this.props

    if (publishToBothApis) {
      this.props.onSubmit(this.props.name, this.props.version, this.props.tags, this.props.main,
        this.props.assetId, this.props.groupId, true, true)
    } else if (publishToExchange && !publishToBothApis) {
      this.props.onSubmit(this.props.name, this.props.version, this.props.tags, this.props.main,
        this.props.assetId, this.props.groupId, false, true)
    } else {
      this.props.onSubmit(this.props.name, this.props.version, this.props.tags, this.props.main,
        this.props.assetId, this.props.groupId, true, false)
    }
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

  handleAssetIdChange(event: any) {
    this.props.onAssetIdChange(event.value)
  }

  handleGroupIdChange(event: any) {
    this.props.onGroupIdChange(event.value)
  }

  handleMainFileChange(event: any) {
    this.props.onMainFileChange(event.value)
  }

  handleSaveTag() {
    this.props.onSubmitTag(this.props.tag)
  }

  handlePublishBothServices() {
    this.props.onPublishToBothApis(!this.props.publishToBothApis)
  }

  isDoneFetching(): Boolean {
    const {isFetching} = this.props
    return isFetching.exchange && isFetching.platform
  }

  isAllFetched(): Boolean {
    const {publishToBothApis, publishToExchange, isFetched} = this.props

    if (publishToBothApis) {
      return isFetched.exchange && isFetched.platform
    } else if (publishToExchange && !publishToBothApis) {
      return isFetched.exchange
    } else {
      return isFetched.platform
    }
  }

  handleErrors() {
    const {error} = this.props
    const errors = []
    if (error.platform) {
      errors.push(
        <div className="error" key='error-platform'>
          {error.platform}
        </div>
      )
    }
    if (error.exchange) {
      errors.push(
        <div className="error" key='error-exchange'>
          {error.exchange}
        </div>
      )
    }
    return errors
  }

  render() {
    const {name, version, tag, tags, onCancel, publishToExchange} = this.props

    const isFetching = this.isDoneFetching()
    const isFetched = this.isAllFetched()
    const canSubmit = this.canSubmit()
    const content = isFetched ? this.link() : this.form(name, version, tag, tags, isFetching)
    const errors = this.handleErrors()

    return (
      <Modal testId="Publish-Modal"
             onEsc={onCancel}
             onClickOverlay={onCancel}
             className="publish-api-modal">
        <ModalHeader>
          <h2>Publish API to {publishToExchange ? 'Exchange' : 'API Platform' }</h2>
        </ModalHeader>
        <ModalBody>
          {content}
          <div className="error-container" data-test-id="Publish-Error">
            {errors}
          </div>
        </ModalBody>
        <ModalFooter className="publish-footer">
          <div className="left-side">
            {publishToExchange &&
            <Checkbox onChange={this.handlePublishBothServices.bind(this)} label="Publish to API Platform"/>}
          </div>
          <div className="right-side">
            <Button kind="tertiary" noFill onClick={onCancel} testId="Publish-Cancel-Button">Cancel</Button>
            {isFetched ? null :
              <Button kind="primary" disabled={isFetching || !canSubmit} testId="Publish-Submit-Button"
                      isLoading={isFetching} onClick={this.handleSave.bind(this)}>
                Publish
              </Button>
            }
          </div>
        </ModalFooter>
      </Modal>
    )
  }

  addExchangeFormFields(isFetching: ?Boolean): [any] {
    const {groupId, assetId, main} = this.props
    return [
      <div className="form-row" key="Form-AssetId">
        <Label className="required">AssetId</Label>
        <TextField value={assetId}
                   placeholder="api-gateway-external"
                   disabled={isFetching}
                   onChange={this.handleAssetIdChange.bind(this)}
                   required
                   testId="Publish-Input-AssetId"/>
      </div>,
      <div className="form-row" key="Form-GroupId">
        <Label className="required">GroupId</Label>
        <TextField value={groupId}
                   placeholder="com.mulesoft"
                   disabled={isFetching}
                   onChange={this.handleGroupIdChange.bind(this)}
                   required
                   testId="Publish-Input-GroupId"/>
      </div>,
      <div className="form-row" key="Form-MainFile">
        <Label className="required">Main File</Label>
        <TextField value={main}
                   placeholder="mainFile.raml"
                   disabled={isFetching}
                   onChange={this.handleMainFileChange.bind(this)}
                   required
                   testId="Publish-Input-MainFile"/>
      </div>
    ]
  }

  form(name: string, version: string, tag: ?string, tags: Array<string>, isFetching: ?Boolean) {
    return (
      <div>
        {this.props.publishToExchange ? this.addExchangeFormFields(isFetching) : null}
        <div className="form-row">
          <Label className="required">Name</Label>
          <TextField value={name}
                     placeholder="Name..."
                     disabled={isFetching}
                     onChange={this.handleNameChange.bind(this)}
                     required
                     testId="Publish-Input-Name"/>
        </div>
        <div className="form-row">
          <Label className="required">Version</Label>
          <TextField value={version}
                     placeholder="Version..."
                     disabled={isFetching}
                     onChange={this.handleVersionChange.bind(this)}
                     required
                     testId="Publish-Input-Version"/>
        </div>
        <div className="form-row">
          <Label>Tags</Label>
          <Pills testId="Publish-Tags-Pills">
            {tags ? tags.map(tag => (
                <Pill key={tag} onRemove={() => this.props.onTagRemove(tag)}>{tag}</Pill>
              )) : null}
          </Pills>
          <div className="tags">
            <TextField className="tag-name"
                       value={tag}
                       placeholder="Tag..."
                       disabled={isFetching}
                       onChange={this.handleTagChange.bind(this)}
                       testId="Publish-Tag-Input-Name"/>
            <Button className="save-tag-button"
                    kind="primary"
                    disabled={!tag}
                    onClick={this.handleSaveTag.bind(this)}
                    noFill
                    testId="Publish-Save-Tag">
              Add
            </Button>
          </div>
        </div>
      </div>
    )
  }

  static generateResponseText(response: any) {
    return `assetId: ${response.assetId} groupId: ${response.groupId} version: ${response.version}`
  }

  link() {
    const links = []
    const {link} = this.props
    if (link.platform) {
      links.push(
        <div>
          <span key='link-platform'>{PublishApiModal.generateResponseText(link.platform)}</span>
        </div>
      )
    }
    if (link.exchange) {
      links.push(
        <div>
          <span key='link-exchange'>{PublishApiModal.generateResponseText(link.exchange)}</span>
        </div>
      )
    }
    return links
  }

  canSubmit() {
    const {name, version, publishToExchange, groupId, assetId, main} = this.props
    const apiPlatformFields = PublishApiModal.isNotEmpty(name) && PublishApiModal.isNotEmpty(version)
    const apiExchangeFields = PublishApiModal.isNotEmpty(groupId) && PublishApiModal.isNotEmpty(assetId)
      && PublishApiModal.isNotEmpty(main)
    return publishToExchange ? (apiPlatformFields && apiExchangeFields) : apiPlatformFields
  }

  static isNotEmpty(value: string) {
    return (value != null && value.length > 0)
  }
}

type Props = {
  name: string,
  version: string,
  tag?: string,
  tags: Array<string>,
  groupId: string,
  assetId: string,
  main: string,
  error: {
    platform: ?string,
    exchange: ?string,
  },
  link: {
    platform: ?any,
    exchange: ?any,
  },
  isFetched: {
    platform: Boolean,
    exchange: Boolean,
  },
  isFetching: {
    platform: Boolean,
    exchange: Boolean,
  },
  publishToExchange: Boolean,
  publishToBothApis: Boolean,

  onCancel: () => void,
  onSubmit: () => void,
  onNameChange?: (name: string) => void,
  onVersionChange?: (version: string) => void,
  onTagChange: (tag: string) => void,
  onTagRemove: (tag: string) => void,
  onSubmitTag: (tag: ?string) => void,
  onAssetIdChange: (assetId: string) => void,
  onGroupIdChange: (groupId: string) => void,
  onMainFileChange: (main: string) => void,
  onPublishToBothApis: (publishBoth: boolean) => void
}

export default PublishApiModal