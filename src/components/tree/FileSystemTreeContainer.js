//@flow

import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getAll} from './selectors'
import {fromFileTree} from './model'
import {pathSelected, folderSelected, move} from './actions'
import {saveFileWithPath, removeFileWithPath} from "../editor/actions"
import {openRenameDialog} from "../modal/rename/RenameActions"
import {openNewFolderDialog} from "../../components/modal/new-folder/NewFolderActions"
import {openNewFileDialog} from "../../components/modal/new-file/NewFileActions"
import type {Node} from './model'
import {getFileTree} from "../../repository-redux/selectors"
import {Path} from '../../repository'
import FileSystemTree from './FileSystemTree'
import './FileSystemTree.css'

type Props = {
  nodes: [Node],
  selected: [string],
  expanded: [string],
  onSelect: (path: Path) => void,
  onToggle: (path: Path, isExpanded: boolean) => void,
  showNewFolderDialog: (path: Path) => void,
  showNewFileDialog: (path: Path) => void,
  moveFile: () => void,
  saveFile: () => void,
  rename: () => void,
  remove: () => void
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
    moveFile: (from: Path, to: Path) => dispatch(move(from, to)),
    showNewFolderDialog: (path: Path) => dispatch(openNewFolderDialog(path)),
    showNewFileDialog: (path: Path) => dispatch(openNewFileDialog(path))
  }
}

export default connect(mapStateToProps, mapDispatch)(FileSystemTree)

