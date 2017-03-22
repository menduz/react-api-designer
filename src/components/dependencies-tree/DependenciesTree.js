//@flow

import React, {Component} from 'react'
import Icon from '../svgicon/SvgIcon'
import TreeUI from '@mulesoft/anypoint-components/lib/Tree'
import RenameModalContainer from "../modal/rename/RenameModalContainer"
import {Path} from '../../repository'
import ContextMenu from '@mulesoft/anypoint-components/lib/ContextMenu'
import './DependenciesTree.css'

class DependenciesTree extends Component {

  handleOnSelect(selection) {
    this.props.onSelect(selection.node.path, selection.node.filePath)
  }

  handleOnToggle(selection) {
    this.props.onToggle(selection.node.path, selection.node.filePath)
  }


  handleDelete(path: Path) {
    this.props.remove(path)
  }


  renderLeaf({node, isSelected}) {

    return (
      <div className="tree-node tree-leaf"
           data-path={node.path.toString()}
           draggable="false">
        <label title={node.label}>
          {node.label}
        </label>
      </div>
    )
  }

  renderFolder({node, isSelected, isExpanded}) {
    const options = [
      {label: 'Remove Dependency', onClick: this.handleDelete.bind(this, node.gav)}
    ]

    return (
      <div className="tree-node tree-folder"
           data-path={node.path.toString()}
           draggable="false">
        <label title={node.label}>
          {node.label}
        </label>
        {node.gav ?
          <div className="node-options">
            <ContextMenu triggerOn={['click']} className="tree-menu folder-menu" options={options} testId="File-Tree-Context-Menu">
              <Icon name="contextmenu" size={18}/>
            </ContextMenu>
          </div> : null}
      </div>
    )
  }

  render() {
    const {nodes, selected, expanded} = this.props
    return nodes ?
      (<div className="Tree">
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
      </div>
    )
  }
}

export default DependenciesTree

