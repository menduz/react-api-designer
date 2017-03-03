//@flow

import React from 'react'
import {connect} from 'react-redux'

import ContextMenu from '@mulesoft/anypoint-components/lib/ContextMenu'
import Icon from '@mulesoft/anypoint-icons/lib/Icon'

import NewFolderModalContainer from '../../modal/new-folder/NewFolderModalContainer'
import NewFileModalContainer from '../../modal/new-file/NewFileModalContainer'
import ImportModalContainer from '../../modal/import/ImportModalContainer'
import ConflictModalContainer from '../../modal/import/conflict/ConflictModalContainer'
import ZipConflictModalContainer from '../../modal/import/zipfile/ZipConflictModalContainer'
import ExportModalContainer from '../../modal/export/ExportModalContainer'

import {openNewFolderDialog} from '../../modal/new-folder/NewFolderActions'
import {openNewFileDialog} from '../../modal/new-file/NewFileActions'
import {openImportDialog} from '../../modal/import/ImportActions'
import {openExportDialog} from '../../modal/export/ExportActions'
import {save} from "../../editor/actions"

import './Menu.css'

class Menu extends React.Component {

  render() {
    const {
      showNewFolderDialog,
      showNewFileDialog,
      showImportDialog,
      showExportDialog,
      saveAll
    } = this.props

    const contextMenuOptions = [
      {label: 'Save All', onClick: saveAll},
      {label: 'Import', onClick: showImportDialog},
      {label: 'Export', onClick: showExportDialog}
    ]

    const addMenuOptions = [
      {label: 'New file', onClick: showNewFileDialog},
      {label: 'New folder', onClick: showNewFolderDialog},
    ]

    return (
      <div className="menu" data-test-id="File-Menu">
        <span className="menu-name">Files</span>

        <div className="menu-content">
          <ContextMenu className="context-menu" options={contextMenuOptions} testId="Context-Menu">
            <Icon className="context-menu-icon" name="contextmenu"/>
          </ContextMenu>

          <ImportModalContainer/>
          <ConflictModalContainer/>
          <ZipConflictModalContainer/>
          <ExportModalContainer/>

          <ContextMenu className="add-menu" options={addMenuOptions} testId="Add-Menu">
            <Icon className="plus-icon" name="plus"/>
          </ContextMenu>

          <NewFileModalContainer/>
          <NewFolderModalContainer/>
        </div>
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
    saveAll: () => dispatch(save())
  }
}

export default connect(mapState, mapDispatch)(Menu)
