//@flow

import React from 'react'
import {connect} from 'react-redux'

import ContextMenu from '@mulesoft/anypoint-components/lib/ContextMenu'
import Icon from '@mulesoft/anypoint-icons/lib/Icon'

import NewFolderModalContainer from '../modal/new-folder/NewFolderModalContainer'
import NewFileModalContainer from '../modal/new-file/NewFileModalContainer'
import ImportModalContainer from '../modal/import/ImportModalContainer'
import ExportModalContainer from '../modal/export/ExportModalContainer'

import {openNewFolderDialog} from '../modal/new-folder/NewFolderActions'
import {openNewFileDialog} from '../modal/new-file/NewFileActions'
import {openImportDialog} from '../modal/import/ImportActions'
import {openExportDialog} from '../modal/export/ExportActions'

import './Menu.css'
import {saveCurrentFile} from "../editor/actions"

class Menu extends React.Component {
  render() {
    let {
      showNewFolderDialog,
      showNewFileDialog,
      showImportDialog,
      showExportDialog,
      saveFile
    } = this.props

    const options = [
      {label: 'Save', onClick: saveFile},
      {label: 'Export', onClick: showExportDialog},
      {label: 'Import', onClick: showImportDialog},
    ]

    return (
      <div className="menu">
        <ContextMenu className="context-menu" options={options} triggerOn={['click']}>
          <Icon className="context-menu-icon" name="contextmenu"/>
        </ContextMenu>

        <ImportModalContainer/>
        <ExportModalContainer/>

        <button className="new-file-button" onClick={showNewFileDialog}/>
        <NewFileModalContainer/>

        <button className="new-folder-button" onClick={showNewFolderDialog}/>
        <NewFolderModalContainer/>
      </div>
    )
  }
}

const mapState = (state) => {
  return {
    name: state.name
  }
}

const mapDispatch = (dispatch) => {
  return {
    showNewFolderDialog: () => dispatch(openNewFolderDialog()),
    showNewFileDialog: () => dispatch(openNewFileDialog()),
    showImportDialog: () => dispatch(openImportDialog()),
    showExportDialog: () => dispatch(openExportDialog()),
    saveFile: () => dispatch(saveCurrentFile())
  }
}

export default connect(mapState, mapDispatch)(Menu)
