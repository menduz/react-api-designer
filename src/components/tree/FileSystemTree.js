//@flow

import React, {Component} from 'react';
import {connect} from 'react-redux'
import TreeUI from 'react-ui-tree'
import cx from 'classnames';
import {getAll} from './selectors';
import {fromFileTree} from './model';
import {treeChanged, pathSelected} from './actions';

import type {Node} from './model';

import './FileSystemTree.css';
import {getFileTree} from "../../repository-redux/selectors";
import {Path} from '../../repository';

type Props = {
  tree: ?Node,
  active: ?Path,
  onTreeChange: (tree: Node) => void,
  onNodeClick: (node: Node) => void
}

class FileSystemTree extends Component {

  constructor(props: Props) {
    super(props)
  }

  handleNodeClick(node: Node) {
    this.props.onNodeClick(node)
  }

  renderNode(node: Node) {
    return (
      <span onClick={this.handleNodeClick.bind(this, node)}
            className={cx('node', { 'is-active': node.path.equalsTo(this.props.active)  })}>
        {`${node.isDirty ? '* ' : ''}${node.module}`}
      </span>
    );
  }

  render() {
    const {tree, onTreeChange} = this.props
    return tree ?
      (
        <div>
          <TreeUI
            className="Tree"
            paddingLeft={20}
            tree={tree}
            isNodeCollapsed={false}
            onChange={onTreeChange.bind(this)}
            renderNode={this.renderNode.bind(this)}
          />
        </div>
      ) : (
        <div>
          Loading...
        </div>
      )
  }
}

const mapStateToProps = (rootState) => {
  const state = getAll(rootState)
  if (!state) return {}

  const fileTree = getFileTree(rootState)
  const tree: ?Node = fileTree ? fromFileTree(fileTree)(state.expandedFiles) : undefined
  return {
    tree: tree,
    active: state.currentPath
  }
}

const mapDispatch = dispatch => {
  return {
    onTreeChange: (tree: Node) => dispatch(treeChanged(tree)),
    onNodeClick: (node: Node) => dispatch(pathSelected(node.path))
  }
}

export default connect(mapStateToProps, mapDispatch)(FileSystemTree)

