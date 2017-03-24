//@flow

import React from 'react'
import Icon from '../../svgicon/SvgIcon'

import Modal from '@mulesoft/anypoint-components/lib/Modal'
import Popover from '@mulesoft/anypoint-components/lib/Popover'
import Select from '@mulesoft/anypoint-components/lib/Select'
import TextField from '@mulesoft/anypoint-components/lib/TextField'
import type {FileType} from './NewFileModel'
import {Path} from '../../../repository'
import './NewFile.css'

type Props = {
  fileName: string,
  fileType: object,
  fileTypeOptions: object[],
  fragmentType: string,
  onSubmit: () => void,
  onCancel: () => void,
  onFileTypeChange: (file: FileType) => void,
  onFragmentTypeChange: (file: FileType) => void,
  onNameChange: () => void,
  showModal: Boolean,
  path?: Path
}

class NewFileModal extends React.Component {
  props: Props

  onNameChange(event: any) {
    this.props.onNameChange(event.value)
  }

  handleSubmit() {
    const {fileName, fileType, fragmentType, path, onSubmit} = this.props

    if (fileName) {
      const type = fileType && fileType.subTypes ? fragmentType : fileType
      onSubmit(fileName, type ? type.value : undefined, path ? path : undefined)
    }
  }

  render() {
    const {fileName, fileTypeOptions, fileType, fragmentType, onCancel, onFileTypeChange, onFragmentTypeChange, showModal} = this.props

    return showModal ? (
      <Modal className="new-file"
             title="Add new file"
             onCancel={onCancel}
             onSubmit={this.handleSubmit.bind(this)}
             onEsc={onCancel}
             onClickOverlay={onCancel}
             testId="New-File-Modal">

        <Select className="selected-file-type"
                options={fileTypeOptions}
                value={fileType}
                onChange={onFileTypeChange}
                clearable={false}
                placeholder="Type..."
                testId="New-File-Select-Type"/>

        {fileType && fileType.subTypes ?
          (<div className="fragment-type">
            <Select className="selected-fragment"
                    options={fileType.subTypes}
                    value={fragmentType}
                    onChange={onFragmentTypeChange}
                    clearable={false}
                    testId="New-File-Select-SubType"/>
            <Popover className="info-small-icon"
                     content={this.getPopoverContent(fragmentType)}
                     triggerOn={['hover']}
                     anchorPosition="br"
                     testId="New-File-Popover">
              <div>
                <Icon name="info-small" size={19} fill="rgb(124, 125, 126)"/>
              </div>
            </Popover>
          </div>)
          : null
        }

        <TextField className="new-file-name"
                   value={fileName}
                   placeholder="Name..."
                   onChange={this.onNameChange.bind(this)}
                   autoFocus
                   testId="New-File-Input-Name"/>
      </Modal>
    ) : null
  }

  getPopoverContent(fragmentType: FileType) {
    const link = 'https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md#'
    return (
      <div className="Popover-in-modal" data-test-id="New-File-Fragment">
        {fragmentType.info}
        <a href={link + fragmentType.link} target="_blank">(read more)</a>
      </div>
    )
  }
}

export default NewFileModal
