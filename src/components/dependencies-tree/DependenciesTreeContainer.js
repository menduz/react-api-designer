//@flow

import {connect} from 'react-redux'
import {getAll, getExpandedFolders, getCurrentPath, isUpdating} from './selectors'
import {fromFileTree} from './model'
import {pathSelected, folderSelected, removeDependency} from './actions'
import type {Node} from './model'
import {getFileTree} from "../../repository-redux/selectors"
import DependenciesTree from './DependenciesTree'
import './DependenciesTree.css'
import Path from "../../repository/Path";

type Props = {
  nodes: ?Node[],
  selected: string[],
  expanded: string[],
  updating: boolean,
  onSelect?: (path: Path) => void,
  onToggle?: (path: Path, isExpanded: boolean) => void,
  remove?: () => void
}

const mapStateToProps = (rootState): $Shape<Props> => {
  const state = getAll(rootState)
  if (!state) return {}

  const fileTree = getFileTree(rootState)
  const nodes: ?Node[] = fileTree ? fromFileTree(fileTree) : undefined
  const expanded:string[] = getExpandedFolders(rootState).toArray().map(p => p.toString())
  let currentPath = getCurrentPath(rootState);
  const selected = currentPath ? [currentPath.toString()] : []
  const updating = isUpdating(rootState)
  return {
    nodes,
    selected,
    expanded,
    updating
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

