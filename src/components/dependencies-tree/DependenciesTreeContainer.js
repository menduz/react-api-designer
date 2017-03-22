//@flow

import {connect} from 'react-redux'
import {getAll, getExpandedFolders, getCurrentPath} from './selectors'
import {fromFileTree} from './model'
import {pathSelected, folderSelected, removeDependency} from './actions'
import type {Node} from './model'
import {getFileTree} from "../../repository-redux/selectors"
import {Path} from '../../repository'
import DependenciesTree from './DependenciesTree'
import './DependenciesTree.css'

type Props = {
  nodes: [Node],
  selected: [string],
  expanded: [string],
  onSelect: (path: Path) => void,
  onToggle: (path: Path, isExpanded: boolean) => void,
  remove: () => void
}

const mapStateToProps = (rootState): Props => {
  const state = getAll(rootState)
  if (!state) return {}

  const fileTree = getFileTree(rootState)
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
    onSelect: (path: Path, filePath: Path) => dispatch(pathSelected(path,filePath)),
    onToggle: (path: Path, filePath: Path) => dispatch(folderSelected(path,filePath)),
    remove: (gav: any) => dispatch(removeDependency(gav)),
  }
}

export default connect(mapStateToProps, mapDispatch)(DependenciesTree)

