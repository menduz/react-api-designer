//@flow

import React, {Component} from 'react'
import TreeUI from '@mulesoft/anypoint-components/lib/Tree'
import RenameModalContainer from "../modal/rename/RenameModalContainer"
import {Path} from '../../repository'
import ContextMenu from '@mulesoft/anypoint-components/lib/ContextMenu'
import Icon from '@mulesoft/anypoint-icons/lib/Icon'
import './FileSystemTree.css'


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

  onDrop(path: Path, event) {
    event.stopPropagation()
    event.preventDefault()

    const from = event.dataTransfer.getData('text/plain');
    if (from)
      this.props.moveFile(Path.fromString(from), path)
  }

  onDragStart(path: Path, event) {
    event.dataTransfer.setData('text/plain', path.toString())
  }

  renderLeaf({node, isSelected}) {
    const options = [
      {label: 'Save', onClick: this.handleSave.bind(this, node.path)},
      {label: 'Rename', onClick: this.handleRename.bind(this, node.path)},
      {label: 'Delete', onClick: this.handleDelete.bind(this, node.path)}
    ]

    return (
      <div className="tree-node tree-leaf"
           data-path={node.path.toString()}
           draggable="true"
           onDragStart={this.onDragStart.bind(this, node.path)}>
        <label>{node.label}</label>
        <ContextMenu className="tree-menu file-menu" options={options} testId="File-Tree-Context-Menu">
          <Icon name="contextmenu"/>
        </ContextMenu>
      </div>
    )
  }

  renderFolder({node, isSelected, isExpanded}) {
    const options = [
      {label: 'Rename', onClick: this.handleRename.bind(this, node.path)},
      {label: 'Delete', onClick: this.handleDelete.bind(this, node.path)}
    ]

    const addOptions = [
      {label: 'New file', onClick: this.openFileDialog.bind(this, node.path)},
      {label: 'New folder', onClick: this.openFolderDialog.bind(this, node.path)},
    ]

    return (
      <div className="tree-node tree-folder"
           data-path={node.path.toString()}
           draggable="true"
           onDragStart={this.onDragStart.bind(this, node.path)}
           onDragOver={event => event.preventDefault()}
           onDrop={this.onDrop.bind(this, node.path)}>
        <label>{node.label}</label>
        <ContextMenu className="tree-menu folder-menu" options={options} testId="File-Tree-Context-Menu">
          <Icon name="contextmenu"/>
        </ContextMenu>
        <ContextMenu className="tree-menu new-menu" options={addOptions} testId="File-Tree-New-Menu">
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
            testId="Tree"
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

export default FileSystemTree

