// @flow

import  React from 'react'

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  TextField,
  Pill,
  Pills,
  Checkbox,
  Spinner,
  Select,
  TextArea,
} from '../../MulesoftComponents'

import './PublishApi.css'

class PublishApiModal extends React.Component {
  props: Props

  handleSave() {
    const {publishToBothApis, publishToExchange} = this.props
    const {name, nextVersion, tags, main, assetId, groupId, description} = this.props

    if (publishToBothApis) {
      this.props.onSubmit(name, nextVersion, tags, main, description, assetId, groupId, true, true)
    } else if (publishToExchange && !publishToBothApis) {
      this.props.onSubmit(name, nextVersion, tags, main, description, assetId, groupId, false, true)
    } else {
      this.props.onSubmit(name, nextVersion, tags, main, description, assetId, groupId, true, false)
    }
  }

  handleNameChange(event: any) {
    if (this.props.onNameChange)
      this.props.onNameChange(event.value)
  }

  handleNextVersionChange(event: any) {
    if (this.props.onNextVersionChange)
      this.props.onNextVersionChange(event.value)
  }

  handleTagChange(event: any) {
    this.props.onTagChange(event.value)
  }

  handleDescriptionChange(event: any) {
    this.props.onDescriptionChange(event.value)
  }

  handleTabKeyPress (e: any) {
    if (e.key === 'Enter') {
      this.handleSaveTag()
    }
  }

  handleSelectFileChange(event: any) {
    this.props.onMainFileChange(event.value)
  }

  handleSaveTag() {
    if (this.props.tag)
      this.props.onSubmitTag(this.props.tag)
  }

  handlePublishBothServices() {
    this.props.onPublishToBothApis(!this.props.publishToBothApis)
  }

  isVariableComplete(variable: any, isFetching: boolean = false): boolean {
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
    const {name, tag, tags, onCancel, publishToExchange, version, nextVersion, description, typeLabel} = this.props

    const isFetching = this.isVariableComplete(this.props.isFetching, true)
    const isFetched = this.isVariableComplete(this.props.isFetched)
    const canSubmit = this.canSubmit()
    const content = isFetched ? this.link() : this.form(name, version, nextVersion, tag, tags, description)
    const errors = this.handleErrors()
    const partialAnswers = this.handlePartialAnswers(isFetching, isFetched)

    return (
      <Modal testId="Publish-Modal"
             onEsc={onCancel}
             onClickOverlay={onCancel}
             className="publish-api-modal">
        <ModalHeader>
          <h1>Publish API {typeLabel} to {publishToExchange ? 'Exchange' : 'API Manager' }</h1>
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
          {isFetching ? (
            <div className="fetching">
              <div className="fetching-spinner"><Spinner size="l"/></div>
              <span>{`Publishing '${name}' version ${nextVersion}`}</span>
            </div>
          ) : content}
        </ModalBody>
        {isFetching ? null :
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
                <Button kind="primary" disabled={!canSubmit} testId="Publish-Submit-Button"
                        onClick={this.handleSave.bind(this)}>Publish</Button>
              }
            </div>
          </ModalFooter>
        }
      </Modal>
    )
  }

  addExchangeFormFields(): [any] {
    const {main, files} = this.props
    return [
      <div className="form-row" key="Form-MainFile">
        <div className="large-col">
          <Label className="required">Main File</Label>
          <Select name="import-type"
                  options={files}
                  value={main}
                  onChange={this.handleSelectFileChange.bind(this)}
                  clearable={false}
                  testId="Publish-Select-MainFile"/>
        </div>
      </div>
    ]
  }

  form(name: string, currentVersion: string, nextVersion: string, tag: ?string, tags: Array<string>, description: string) {
    const {isLoading, publishToExchange} = this.props
    return (
      isLoading ? <div className="search-spinner"><Spinner size="l"/></div> :
        <div>
          <div className="form-row">
            <div className="form-col">
              <Label className="required">Name</Label>
              <TextField value={name}
                         placeholder="Name..."
                         onChange={this.handleNameChange.bind(this)}
                         required
                         testId="Publish-Input-Name"/>
            </div>
            <div className="form-col">
              <Label className="required">Version</Label>
              <TextField value={nextVersion}
                         placeholder="Version..."
                         onChange={this.handleNextVersionChange.bind(this)}
                         required
                         testId="Publish-Input-NextVersion"/>
              {currentVersion ? <small>Current version: {currentVersion}</small> : null}
            </div>
          </div>
          <div className="form-row">
            <div className="large-col">
              <Label className="required">Description</Label>
              <TextArea style={{ height: 65 }}
                        placeholder="Add a description"
                        value={description}
                        required
                        onChange={this.handleDescriptionChange.bind(this)}/>
            </div>
          </div>
          {publishToExchange ? this.addExchangeFormFields() : null}
          <div className="form-row">
            <div className="large-col">
              <Label>Tags</Label>
              <Pills className="pills" testId="Publish-Tags-Pills">
                {tags ? tags.map(tag => (
                    <Pill className="pill" key={tag} onRemove={() => this.props.onTagRemove(tag)}>{tag}</Pill>
                  )) : null}
              </Pills>
              <div className="tags">
                <TextField className="tag-name"
                           value={tag}
                           placeholder="Tag..."
                           onChange={this.handleTagChange.bind(this)}
                           onKeyPress={this.handleTabKeyPress.bind(this)}
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
        </div>
    )
  }

  static generatePlatformResponse(response: any) {
    return (
      <div key='answer-platform'>
        <h3>Successfully published to API Manager</h3>
        <div className="answer">
          Published version {response.versionName}.
          Click <a href={response.url} target="_blank">here</a> to view it.
        </div>
      </div>
    )
  }

  static generateExchangeResponse(response: any) {
    return (
      <div key='answer-exchange'>
        <h3>Successfully published to Exchange</h3>
        <div className="answer">
          Published version {response.version}.
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

  canSubmit(): boolean {
    const {name, nextVersion, publishToExchange, main, description} = this.props
    const apiPlatformFields = PublishApiModal.isNotEmpty(name) && PublishApiModal.isNotEmpty(nextVersion)
      && PublishApiModal.isNotEmpty(description)
    const apiExchangeFields = PublishApiModal.isNotEmpty(main)
    return publishToExchange ? (apiPlatformFields && apiExchangeFields) : apiPlatformFields
  }

  static isNotEmpty(value: string): boolean {
    return value && value.trim().length > 0
  }
}

type Props = {
  name?: string,
  version?: string,
  nextVersion?: string,
  description?: string,
  files: [],
  tag?: string,
  tags?: Array<string>,
  groupId?: string,
  assetId?: string,
  main?: string,
  typeLabel?: string,
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
    platform: boolean,
    exchange: boolean,
  },
  isFetching: {
    platform: boolean,
    exchange: boolean,
  },
  publishToExchange: boolean,
  publishToBothApis: boolean,

  onCancel: () => void,
  onSubmit: (name: string, version: string, tags: Array<string>, main: string, description: string,
             assetId: string, groupId: string, platform: boolean, exchange: boolean) => void,
  onDescriptionChange: (description: string) => void,
  onNameChange?: (name: string) => void,
  onNextVersionChange?: (nextVersion: string) => void,
  onTagChange: (tag: string) => void,
  onTagRemove: (tag: string) => void,
  onSubmitTag: (tag: ?string) => void,
  onMainFileChange: (main: string) => void,
  onPublishToBothApis: (publishBoth: boolean) => void
}

export default PublishApiModal