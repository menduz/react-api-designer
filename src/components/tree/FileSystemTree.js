//@flow

import React, {Component} from 'react'
import {connect} from 'react-redux'
import TreeUI from '@mulesoft/anypoint-components/lib/Tree'
import {getAll} from './selectors'
import {fromFileTree} from './model'
import {pathSelected, folderSelected} from './actions'
import {saveFileWithPath, removeFileWithPath} from "../editor/actions"
import {openRenameDialog} from "../modal/rename/RenameActions"
import {openNewFolderDialog} from "../../components/modal/new-folder/NewFolderActions"
import {openNewFileDialog} from "../../components/modal/new-file/NewFileActions"
import RenameModalContainer from "../modal/rename/RenameModalContainer"

import type {Node} from './model'

import './FileSystemTree.css'
import {getFileTree} from "../../repository-redux/selectors"
import {Path} from '../../repository'

import ContextMenu from '@mulesoft/anypoint-components/lib/ContextMenu'
import Icon from '@mulesoft/anypoint-icons/lib/Icon'

type Props = {
  nodes: [Node],
  selected: [string],
  expanded: [string],
  onSelect: (path: Path) => void,
  onToggle: (path: Path, isExpanded: boolean) => void,
  showNewFolderDialog: (path: Path) => void,
  showNewFileDialog: (path: Path) => void,
  saveFile: () => void,
  rename: () => void,
  remove: () => void
}

class FileSystemTree extends Component {

  handleOnSelect(selection) {
    this.props.onSelect(selection.node.path)
  }

  handleOnToggle(selection) {
    this.props.onToggle(selection.node.path)
  }

  handleSave(path: Path) {
    this.props.saveFile(path)
  }

  handleRename(path: Path) {
    this.props.rename(path)
  }

  handleDelete(path: Path) {
    this.props.remove(path)
  }

  openFileDialog(path: Path) {
    this.props.showNewFileDialog(path)
  }

  openFolderDialog(path: Path) {
    this.props.showNewFolderDialog(path)
  }

  renderLeaf({node, path, isSelected}) {
    const options = [
      {label: 'Save', onClick: this.handleSave.bind(this, node.path)},
      {label: 'Rename', onClick: this.handleRename.bind(this, node.path)},
      {label: 'Delete', onClick: this.handleDelete.bind(this, node.path)}
    ]

    return (
      <div className="tree-node tree-leaf">
        <label>{node.label}</label>
        <ContextMenu className="tree-menu file-menu" options={options}>
          <Icon name="contextmenu"/>
        </ContextMenu>
      </div>
    )
  }

  renderFolder({node, path, isSelected, isExpanded}) {
    const options = [
      {label: 'Rename', onClick: this.handleRename.bind(this, node.path)},
      {label: 'Delete', onClick: this.handleDelete.bind(this, node.path)}
    ]

    const addOptions = [
      {label: 'New file', onClick: this.openFileDialog.bind(this, node.path)},
      {label: 'New folder', onClick: this.openFolderDialog.bind(this, node.path)},
    ]

    return (
      <div className="tree-node tree-folder">
        <label>{node.label}</label>
        <ContextMenu className="tree-menu folder-menu" options={options}>
          <Icon name="contextmenu"/>
        </ContextMenu>
        <ContextMenu className="tree-menu new-menu" options={addOptions}>
          <Icon name="plus"/>
        </ContextMenu>
      </div>
    )
  }

  render() {
    const {nodes, selected, expanded} = this.props

    return nodes ?
      (<div>
          <TreeUI
            className="Tree"
            getLeaf={this.renderLeaf.bind(this)}
            getFolder={this.renderFolder.bind(this)}
            getEmpty={()=> 'Empty'}
            nodes={nodes}
            selected={selected}
            expanded={expanded}
            onSelect={this.handleOnSelect.bind(this)}
            onToggle={this.handleOnToggle.bind(this)}
          />
          <RenameModalContainer/>
        </div>
      ) : (
      <div className="Tree-loading">
        Loading...
      </div>
    )
  }
}

const mapStateToProps = (rootState): Props => {
  const state = getAll(rootState)
  if (!state) return {}

  const fileTree = getFileTree(rootState)
  const nodes: ?Node[] = fileTree ? fromFileTree(fileTree) : undefined
  const expanded = state.expandedFolders.toArray().map(p => p.toString())
  const selected = state.currentPath ? [state.currentPath.toString()] : []
  return {
    nodes,
    selected,
    expanded
  }
}

const mapDispatch = dispatch => {
  return {
    onSelect: (path: Path) => dispatch(pathSelected(path)),
    onToggle: (path: Path) => dispatch(folderSelected(path)),
    rename: (path: Path) => dispatch(openRenameDialog(path.toString())),
    saveFile: (path: Path) => dispatch(saveFileWithPath(path)),
    remove: (path: Path) => dispatch(removeFileWithPath(path)),
    showNewFolderDialog: (path: Path) => dispatch(openNewFolderDialog(path)),
    showNewFileDialog: (path: Path) => dispatch(openNewFileDialog(path))
  }
}

export default connect(mapStateToProps, mapDispatch)(FileSystemTree)

