//@flow

import {connect} from 'react-redux'
import {getAll, getExpandedFolders, getCurrentPath} from './selectors'
import {fromFileTree} from './model'
import {pathSelected, folderSelected} from './actions'
import type {Node} from './model'
import {getDependenciesTree} from "../../repository-redux/selectors"
import {Path} from '../../repository'
import DependenciesTree from './DependenciesTree'
import './DependenciesTree.css'

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

  const fileTree = getDependenciesTree(rootState)
  const nodes: ?Node[] = fileTree ? fromFileTree(fileTree) : undefined
  const expanded = getExpandedFolders(rootState).toArray().map(p => p.toString())
  const selected = getCurrentPath(rootState) ? [getCurrentPath(rootState).toString()] : []
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
    //remove: (path: Path) => dispatch(removeFileWithPath(path)),
  }
}

export default connect(mapStateToProps, mapDispatch)(DependenciesTree)

