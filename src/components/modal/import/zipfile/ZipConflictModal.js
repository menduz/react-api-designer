//@flow

import React from 'react'

import Button from '@mulesoft/anypoint-components/lib/Button'
import Modal from '@mulesoft/anypoint-components/lib/Modal'
import ModalHeader from '@mulesoft/anypoint-components/lib/ModalHeader'
import ModalBody from '@mulesoft/anypoint-components/lib/ModalBody'
import ModalFooter from '@mulesoft/anypoint-components/lib/ModalFooter'
import Affix from '@mulesoft/anypoint-components/lib/Affix'
import RadioGroup from '@mulesoft/anypoint-components/lib/RadioGroup'
import Radio from '@mulesoft/anypoint-components/lib/Radio'
import Tab from '@mulesoft/anypoint-components/lib/Tab'
import TabList from '@mulesoft/anypoint-components/lib/TabList'
import Tabs from '@mulesoft/anypoint-components/lib/Tabs'
import TabPanel from '@mulesoft/anypoint-components/lib/TabPanel'
import Label from '@mulesoft/anypoint-components/lib/Label'

import {DO_NOT_REPLACE, REPLACE_ALL, ALL_FILES_ACTION, BY_FILES_ACTION} from './constants'

import './ZipConflict.css'

type Props = {
  selectValue: string,
  onSubmit: () => void,
  onCancel: () => void,
  showConflictModal: Boolean,
  isImporting: Boolean,
  fileNameToImport: string,
  onAllFilesActionChange: (value: string) => void,
  zipFileActionChange: (value: string) => void
}

class ZipConflictModal extends React.Component {
  props: Props

  constructor(props) {
    super(props);
    this.onRef = this.onRef.bind(this);

    this.state = {
      open: false,
      container: null
    };
  }

  onRef(node) {
    if (node == null) return;
    console.log('node! ' + node)
    if (node !== this.state.container) this.setState({ container: node });
  }

  tabChange(e) {
    console.log('value', e);
    const value = (e.value === 0)?ALL_FILES_ACTION:BY_FILES_ACTION
    console.log('value!: ' + value)
    this.props.zipFileActionChange(value)
  }

  onAllFilesActionChange(e) {
    const value = e.value;
    //this.setState({ value });
    this.props.onAllFilesActionChange(value)
  }

  render() {
    const {
      onSubmit,
      onCancel,
      showZipConflictModal,
      fileNameToImport,
      allFilesAction
    } = this.props

    if (showZipConflictModal) {
      return (
        <Modal className="conflict-modal"
               onCancel={onCancel}
               onSubmit={onSubmit}
               onEsc={onCancel}
               onEnter={onSubmit}
               onClickOverlay={onCancel}>

          <ModalHeader>
            <h2>Import {fileNameToImport}</h2>
          </ModalHeader>
          <ModalBody>
            <Tabs type="secondary" align="left" onChange={this.tabChange.bind(this)}>
              <div style={{ width: '90px' }}>
                <Affix offsetTop={19} target={this.state.container} affixClassName="affix usage-1" >
                  <TabList>
                    <Tab>All files</Tab>
                    <Tab>By files</Tab>
                  </TabList>
                </Affix>
              </div>
              <TabPanel>
                <div>
                  <Label>All files</Label>
                  <RadioGroup
                    //label="All files"
                    onChange={this.onAllFilesActionChange.bind(this)}
                    value={allFilesAction}
                  >
                    <Radio label="Replace all" value={REPLACE_ALL} />
                    <Radio label="Do not replace" value={DO_NOT_REPLACE} />
                  </RadioGroup>
                </div>
              </TabPanel>
              <TabPanel>This can not be scrolled</TabPanel>
            </Tabs>
          </ModalBody>

          <ModalFooter>
            <Button kind="tertiary" onClick={onCancel} noFill>Cancel</Button>
            <Button kind="primary" onClick={onSubmit}>Replace</Button>
          </ModalFooter>

        </Modal>
      )
    }
    return null
  }
}


export default ZipConflictModal
