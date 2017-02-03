//@flow

import React, {Component} from 'react';
import {connect} from 'react-redux'
import TreeUI from '@mulesoft/anypoint-components/lib/Tree'
import {getAll} from './selectors';
import {fromFileTree} from './model';
import {pathSelected} from './actions';

import type {Node} from './model';

import './FileSystemTree.css';
import {getFileTree} from "../../repository-redux/selectors";
import {Path} from '../../repository';

type Props = {
  nodes: [Node],
  selected: [Path],
  onSelect: (path: Path) => void
}

class FileSystemTree extends Component {

  handleOnSelect(selection) {
    this.props.onSelect(selection.node.path)
  }

  getEmpty() {
    return !this.props.nodes ? 'Loading...' : 'Empty'
  }

  render() {
    const {nodes, selected} = this.props
    return <TreeUI
      className="Tree"
      getEmpty={this.getEmpty.bind(this)}
      nodes={nodes}
      selected={selected}
      onSelect={this.handleOnSelect.bind(this)}
    />
  }
}

const mapStateToProps = (rootState): Props => {
  const state = getAll(rootState)
  if (!state) return {}

  const fileTree = getFileTree(rootState)
  const nodes: ?Node = fileTree ? fromFileTree(fileTree) : undefined
  // const expanded = state.expandedFiles ? state.expandedFiles.toArray() : []
  const selected = state.currentPath ? [state.currentPath.toString()] : []
  return {
    nodes,
    selected
  }
}

const mapDispatch = dispatch => {
  return {
    onSelect: (path: Path) => dispatch(pathSelected(path))
  }
}

export default connect(mapStateToProps, mapDispatch)(FileSystemTree)

