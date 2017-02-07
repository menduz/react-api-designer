//@flow

import React, {Component} from 'react'
import {connect} from 'react-redux'
import TreeUI from '@mulesoft/anypoint-components/lib/Tree'
import {getAll} from './selectors'
import {fromFileTree} from './model'
import {pathSelected, folderSelected} from './actions'
import {saveFileWithPath, removeFileWithPath} from "../editor/actions"
import {openRenameDialog} from "../modal/rename/RenameActions"
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

  handleSave(path: string) {
    this.props.saveFile(Path.fromString(path))
  }

  handleRename(path: string) {
    this.props.rename(Path.fromString(path))
  }

  handleDelete(path: string) {
    this.props.remove(Path.fromString(path))
  }

  renderLeaf({node, path, isSelected}) {
    const options = [
      {label: 'Save', onClick: this.handleSave.bind(this, path)},
      {label: 'Rename', onClick: this.handleRename.bind(this, path)},
      {label: 'Delete', onClick: this.handleDelete.bind(this, path)}
    ]

    return (
      <div className="tree-node tree-leaf">
        <label>{node.label}</label>
        <ContextMenu className="file-menu" options={options}>
          <Icon className="file-menu-icon" name="contextmenu"/>
        </ContextMenu>
      </div>
    )
  }

  renderFolder({node, path, isSelected, isExpanded}) {
    const options = [
      {label: 'Rename', onClick: this.handleRename.bind(this, path)},
      {label: 'Delete', onClick: this.handleDelete.bind(this, path)}
    ]

    return (
      <div className="tree-node tree-folder">
        <label>{node.label}</label>
        <ContextMenu className="file-menu" options={options}>
          <Icon className="file-menu-icon" name="contextmenu"/>
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
    remove: (path: Path) => dispatch(removeFileWithPath(path))
  }
}

export default connect(mapStateToProps, mapDispatch)(FileSystemTree)

