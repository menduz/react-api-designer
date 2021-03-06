//@flow

import {connect} from 'react-redux'
import {getAll, getExpandedFolders, getCurrentPath} from './selectors'
import {fromFileTree} from './model'
import {pathSelected, folderSelected, move} from './actions'
import {saveFileWithPath, removeFileWithPath} from "../editor/actions"
import {openRenameDialog} from "../modal/rename/RenameActions"
import {openNewFolderDialog} from "../../components/modal/new-folder/NewFolderActions"
import {openNewFileDialog} from "../../components/modal/new-file/NewFileActions"
import {getFileTree} from "../../repository-redux/selectors"
import {Path} from '../../repository'
import FileSystemTree from './FileSystemTree'

import type {Node} from './model'
import type {Dispatch} from '../../types/index'

import './FileSystemTree.css'

type Props = {
  nodes: ?Node[],
  selected: ?string[],
  expanded: string[],
  onSelect: (path: Path) => void,
  onToggle: (path: Path, isExpanded: boolean) => void,
  showNewFolderDialog: (path: Path) => void,
  showNewFileDialog: (path: Path) => void,
  moveFile: (from: Path, to: Path) => void,
  saveFile: (path: Path) => void,
  rename: (path: Path) => void,
  remove: (path: Path) => void
}

const mapStateToProps = (rootState: any): $Shape<Props> => {
  const state = getAll(rootState)
  if (!state) return {}

  const fileTree = getFileTree(rootState)
  const nodes: ?Node[] = fileTree ? fromFileTree(fileTree) : undefined
  const expanded = getExpandedFolders(rootState).toArray().map(p => p.toString())
  const currentPath = getCurrentPath(rootState)
  const selected = currentPath ? [currentPath.toString()] : []
  return {
    nodes,
    selected,
    expanded
  }
}

const mapDispatch = (dispatch: Dispatch): $Shape<Props> => {
  return {
    onSelect: (path: Path) => dispatch(pathSelected(path)),
    onToggle: (path: Path) => dispatch(folderSelected(path)),
    rename: (path: Path) => dispatch(openRenameDialog(path)),
    saveFile: (path: Path) => dispatch(saveFileWithPath(path)),
    remove: (path: Path) => dispatch(removeFileWithPath(path)),
    moveFile: (from: Path, to: Path) => dispatch(move(from, to)),
    showNewFolderDialog: (path: Path) => dispatch(openNewFolderDialog(path)),
    showNewFileDialog: (path: Path) => dispatch(openNewFileDialog(path))
  }
}

export default connect(mapStateToProps, mapDispatch)(FileSystemTree)

