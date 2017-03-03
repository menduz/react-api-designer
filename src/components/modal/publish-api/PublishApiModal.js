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
import Spinner from '@mulesoft/anypoint-components/lib/Spinner'

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

  isVariableComplete(variable, isFetching = false): Boolean {
    const {publishToBothApis, publishToExchange} = this.props

    if (publishToBothApis)
      return isFetching ? variable.exchange || variable.platform : variable.exchange && variable.platform
    else if (publishToExchange && !publishToBothApis)
      return variable.exchange
    else
      return variable.platform
  }

  handleErrors() {
    const {error} = this.props
    const errors = []
    if (error.platform) {
      errors.push(
        <div key='error-platform'>
          <h3>API Manager error</h3>
          <div className="error">
            {error.platform}
          </div>
        </div>
      )
    }
    if (error.exchange) {
      errors.push(
        <div key='error-exchange'>
          <h3>Exchange error</h3>
          <div className="error">
            {error.exchange}
          </div>
        </div>
      )
    }
    return errors
  }

  handlePartialAnswers(isFetching: boolean, isAllFetched: boolean) {
    if (!isFetching && !isAllFetched) {
      const {link} = this.props
      let answer = ''
      if (link.platform)
        answer = (PublishApiModal.generatePlatformResponse(link.platform))
      if (link.exchange)
        answer = PublishApiModal.generateExchangeResponse(link.exchange)
      return answer
    }
    return null
  }

  render() {
    const {name, version, tag, tags, onCancel, publishToExchange} = this.props

    const isFetching = this.isVariableComplete(this.props.isFetching, true)
    const isFetched = this.isVariableComplete(this.props.isFetched)
    const canSubmit = this.canSubmit()
    const content = isFetched ? this.link() : this.form(name, version, tag, tags, isFetching)
    const errors = this.handleErrors()
    const partialAnswers = this.handlePartialAnswers(isFetching, isFetched)

    return (
      <Modal testId="Publish-Modal"
             onEsc={onCancel}
             onClickOverlay={onCancel}
             className="publish-api-modal">
        <ModalHeader>
          <h1>Publish API to {publishToExchange ? 'Exchange' : 'API Manager' }</h1>
        </ModalHeader>
        <ModalBody>
          {partialAnswers ?
            <div className="partial-answers" data-test-id="Publish-Partial-Answers">
              {partialAnswers}
            </div> : null
          }
          {errors ?
            <div className="error-container" data-test-id="Publish-Error">
              {errors}
            </div> : null
          }
          {content}
        </ModalBody>
        <ModalFooter className="publish-footer">
          <div className="left-side">
            {(publishToExchange && !isFetched) &&
            <Checkbox onChange={this.handlePublishBothServices.bind(this)} label="Also publish to API Manager"/>}
          </div>
          <div className="right-side">
            <Button kind="tertiary" noFill onClick={onCancel} testId="Publish-Cancel-Button">
              {isFetched ? 'Close' : 'Cancel'}
            </Button>
            {isFetched ? null :
              <Button kind="primary" disabled={isFetching || !canSubmit} testId="Publish-Submit-Button"
                      isLoading={isFetching} onClick={this.handleSave.bind(this)}>
                {isFetching ? 'Publishing...' : 'Publish'}
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
      <div className="form-row" key="Form-Asset-Group-Ids">
        <div className="form-col">
          <Label className="required">GroupId</Label>
          <TextField value={groupId}
                     placeholder="com.mulesoft"
                     disabled={isFetching}
                     onChange={this.handleGroupIdChange.bind(this)}
                     required
                     testId="Publish-Input-GroupId"/>
        </div>
        <div className="form-col">
          <Label className="required">AssetId</Label>
          <TextField value={assetId}
                     placeholder="api-gateway-external"
                     disabled={isFetching}
                     onChange={this.handleAssetIdChange.bind(this)}
                     required
                     testId="Publish-Input-AssetId"/>
        </div>
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
    const {isLoading, publishToExchange, publishToBothApis} = this.props
    return (
      isLoading ? <div className="search-spinner"><Spinner size="l"/></div> :
        <div>
          {publishToExchange ? this.addExchangeFormFields(isFetching) : null}
          <div className="form-row">
            <div className="form-col">
              <Label className="required">Name</Label>
              <TextField value={name}
                         placeholder="Name..."
                         disabled={isFetching}
                         onChange={this.handleNameChange.bind(this)}
                         required
                         testId="Publish-Input-Name"/>
            </div>
            <div className="form-col">
              <Label className="required">Version</Label>
              <TextField value={version}
                         placeholder="Version..."
                         disabled={isFetching}
                         onChange={this.handleVersionChange.bind(this)}
                         required
                         testId="Publish-Input-Version"/>
            </div>
          </div>
          {!publishToExchange || publishToBothApis ?
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
            </div> : null
          }
        </div>
    )
  }

  static generateExchangeResponse(response: any) {
    return (
      <div key='answer-exchange'>
        <h3>Successfully published to Exchange</h3>
        <div className="answer">AssetId: {response.assetId}</div>
        <div className="answer">GroupId: {response.groupId}</div>
        <div className="answer">Version: {response.version}</div>
      </div>
    )
  }

  static generatePlatformResponse(response: any) {
    return (
      <div key='answer-platform'>
        <h3>Successfully published to API Manager</h3>
        <div className="answer">
          Published {response.apiName} version {response.versionName}.
          Click <a href={response.url} target="_blank">here</a> to view it.
        </div>
      </div>
    )
  }

  link() {
    const links = []
    const {link} = this.props
    if (link.platform)
      links.push(PublishApiModal.generatePlatformResponse(link.platform))
    if (link.exchange)
      links.push(PublishApiModal.generateExchangeResponse(link.exchange))
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
  isLoading: boolean,
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