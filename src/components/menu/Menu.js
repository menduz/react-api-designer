//@flow

import React from 'react'
import {connect} from 'react-redux'

import ContextMenu from '@mulesoft/anypoint-components/lib/ContextMenu'
import Icon from '@mulesoft/anypoint-icons/lib/Icon'

import NewFolderModalContainer from '../modal/new-folder/NewFolderModalContainer'
import NewFileModalContainer from '../modal/new-file/NewFileModalContainer'
import ImportModalContainer from '../modal/import/ImportModalContainer'
import ConflictModalContainer from '../modal/import/conflict/ConflictModalContainer'
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

    const contextMenuOptions = [
      {label: 'Save', onClick: saveFile},
      {label: 'Export', onClick: showExportDialog},
      {label: 'Import', onClick: showImportDialog},
    ]

    const addMenuOptions = [
      {label: 'New file', onClick: showNewFileDialog},
      {label: 'New folder', onClick: showNewFolderDialog},
    ]

    return (
      <div className="menu">
        <ContextMenu className="context-menu" options={contextMenuOptions} triggerOn={['click']}>
          <Icon className="context-menu-icon" name="contextmenu"/>
        </ContextMenu>

        <ImportModalContainer/>
        <ConflictModalContainer/>
        <ExportModalContainer/>

        <ContextMenu className="add-menu" options={addMenuOptions} triggerOn={['click']}>
          <Icon className="plus-icon" name="plus"/>
        </ContextMenu>

        <NewFileModalContainer/>
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
