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
import Checkbox from '@mulesoft/anypoint-components/lib/Checkbox'


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
  zipFileActionChange: (value: string) => void,
  zipFileOverrideAction: (filename:string, override:Boolean) => void,
  zipFiles: Array,
  zipFileAction:string
}

class ZipConflictModal extends React.Component {
  props: Props

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      container: null
    };
  }

  tabChange(e) {
    if (e.event) {
      console.log('tabChange', e.event);
      e.event.preventDefault();
      //e.preventDefault()
      const value = (e.value === 0)?ALL_FILES_ACTION:BY_FILES_ACTION
      this.props.zipFileActionChange(value)
    }
  }

  onAllFilesActionChange(e) {
    console.log('onAllFilesActionChange', e.event);
    //e.event.preventDefault();
    const value = e.value;
    //this.setState({ value });
    this.props.onAllFilesActionChange(value)
  }

  onCheckFileChange(filename, e) {
    console.log('onCheckFileChange', e.event);
    //e.event.preventDefault();
    this.props.zipFileOverrideAction(filename, e.value)
  }

  renderZipFiles(files) {
    const filter = files.filter(f => {return f.conflict})
    const margin = { marginBottom: 20 };

    if (filter.length > 0) {
      return filter.map((file) => (
        //<Label>{file.filename + " " + file.override}</Label>
        <div style={margin}>
          <Checkbox
            name={file.filename}
            label={file.filename}
            onChange={this.onCheckFileChange.bind(this, file.filename)}
            checked={file.override}
          />
        </div>
      ));
    }
    else return [];
  }

  render() {
    const {
      onSubmit,
      onCancel,
      showZipConflictModal,
      fileNameToImport,
      allFilesAction,
      zipFiles,
      zipFileAction
    } = this.props

    const files = this.renderZipFiles(zipFiles);
    const selectedIndex = (zipFileAction === ALL_FILES_ACTION)?0:1
    console.log("zipFileAction render" + zipFileAction + " selectedIndex " + selectedIndex)

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
            <Tabs type="secondary" align="left" onChange={this.tabChange.bind(this)} selectedIndex={selectedIndex}>
              <div style={{ width: '100px' }}>
                <Affix offsetTop={200} target={this.state.container} affixClassName="affix usage-1" >
                  <TabList>
                    <Tab>All files</Tab>
                    <Tab>By files</Tab>
                  </TabList>
                </Affix>
              </div>
              <TabPanel>
                <div>
                  <h3>All files</h3>
                  <RadioGroup
                    onChange={this.onAllFilesActionChange.bind(this)}
                    value={allFilesAction}
                  >
                    <Radio label="Replace all" value={REPLACE_ALL} />
                    <Radio label="Do not replace" value={DO_NOT_REPLACE} />
                  </RadioGroup>
                </div>
              </TabPanel>
              <TabPanel>
                <div>
                  <h3>By files</h3>
                  {files}
                </div>
              </TabPanel>
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
