//@flow

import React, {Component} from 'react'
import ReactSVG from 'react-svg'
import plusIcon from '@mulesoft/anypoint-icons/lib/assets/plus.svg'
import contextIcon from '@mulesoft/anypoint-icons/lib/assets/contextmenu.svg'
import TreeUI from '@mulesoft/anypoint-components/lib/Tree'
import RenameModalContainer from "../modal/rename/RenameModalContainer"
import {Path} from '../../repository'
import ContextMenu from '@mulesoft/anypoint-components/lib/ContextMenu'
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

  onDropInFile(path: Path, event) {
    this.onDropInFolder(path.parent(), event)
    this.onDragLeave(event)
  }

  onDropInFolder(path: Path, event) {
    event.stopPropagation()
    event.preventDefault()

    const from = event.dataTransfer.getData('text/plain');
    if (from && Path.fromString(from).parent().toString() !== path.toString())
      this.props.moveFile(Path.fromString(from), path)

    this.onDragLeave(event)
  }

  onRootDrop(event) {
    this.onDropInFolder(Path.emptyPath(true), event)
  }

  onDragStart(path: Path, event) {
    event.dataTransfer.setData('text/plain', path.toString())
  }

  onDragEnter(event) {
    event.target.classList.add('dropping')
  }

  onDragLeave(event) {
    event.target.classList.remove('dropping')
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
           onDragEnter={this.onDragEnter.bind(this)}
           onDragLeave={this.onDragLeave.bind(this)}
           onDragStart={this.onDragStart.bind(this, node.path)}
           onDrop={this.onDropInFile.bind(this, node.path)}>
        <label onDragEnter={this.onDragEnter.bind(this)}
               onDragLeave={this.onDragLeave.bind(this)}>
          {node.label}
        </label>
        <div className="node-options">
          <ContextMenu className="tree-menu file-menu" options={options} testId="File-Tree-Context-Menu">
            <ReactSVG path={contextIcon} style={{width: 18}}/>
          </ContextMenu>
        </div>
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
           onDragEnter={this.onDragEnter.bind(this)}
           onDragLeave={this.onDragLeave.bind(this)}
           onDragStart={this.onDragStart.bind(this, node.path)}
           onDragOver={event => event.preventDefault()}
           onDrop={this.onDropInFolder.bind(this, node.path)}>
        <label onDragEnter={this.onDragEnter.bind(this)}
               onDragLeave={this.onDragLeave.bind(this)}>
          {node.label}
        </label>
        <div className="node-options">
          <ContextMenu className="tree-menu new-menu" options={addOptions} testId="File-Tree-New-Menu">
            <ReactSVG path={plusIcon} style={{ width: 18}}/>
          </ContextMenu>
          <ContextMenu className="tree-menu folder-menu" options={options} testId="File-Tree-Context-Menu">
            <ReactSVG path={contextIcon} style={{ width: 18}}/>
          </ContextMenu>
        </div>
      </div>
    )
  }

  render() {
    const {nodes, selected, expanded} = this.props

    return nodes ?
      (<div className="Tree"
            onDrop={this.onRootDrop.bind(this)}
            onDragOver={event => event.preventDefault()}>
          <TreeUI className="TreeUi"
                  getLeaf={this.renderLeaf.bind(this)}
                  getFolder={this.renderFolder.bind(this)}
                  getEmpty={()=> 'Empty'}
                  nodes={nodes}
                  selected={selected}
                  expanded={expanded}
                  onSelect={this.handleOnSelect.bind(this)}
                  onToggle={this.handleOnToggle.bind(this)}
                  testId="Tree"/>
          <RenameModalContainer/>
        </div>
      ) : (
      <div className="Tree-loading" data-test-id="Tree-Loading">
        Loading...
      </div>
    )
  }
}

export default FileSystemTree

