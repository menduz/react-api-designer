//@flow

import React, {Component} from 'react';
import {connect} from 'react-redux'
import TreeUI from 'react-ui-tree'
import cx from 'classnames';
import {getAll} from './selectors';
import {fromFileSystem} from './model';
import {treeChanged, nodeSelected} from './actions';

import type {Node} from './model';

import './FileSystemTree.css';

type Props = {
    tree: ?Node,
    active: ?Node,
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

    renderNode(node) {
        return (
            <span
                className={cx('node', { 'is-active': node === this.props.active })}
                onClick={this.handleNodeClick.bind(this, node)}
            >
                {node.module}
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

    const tree: ?Node = state.fileSystem ? fromFileSystem(state.fileSystem)(state.expandedFiles) : undefined
    return {
        tree: tree,
        active: state.currentNode
    }
}

const mapDispatch = dispatch => {
    return {
        onTreeChange: tree => dispatch(treeChanged(tree)),
        onNodeClick: node => dispatch(nodeSelected(node))
    }
}

export default connect(mapStateToProps, mapDispatch)(FileSystemTree)

