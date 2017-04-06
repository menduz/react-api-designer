//@flow

import {connect} from 'react-redux'
import {getAll, getExpandedFolders, getCurrentPath, isUpdating} from './selectors'
import {fromFileTree} from './model'
import {pathSelected, folderSelected} from './actions'
import {getFileTree} from '../../repository-redux/selectors'
import {Path} from '../../repository'
import DependenciesTree from './DependenciesTree'
import {checkForUpdates} from '../modal/dependency/DependencyActions'

import type {Node} from './model'
import type {GAV} from '../modal/dependency/DependencyModel'
import './DependenciesTree.css'

type Props = {
  nodes: ?Node[],
  selected: string[],
  expanded: string[],
  updating: boolean,
  onSelect?: (path: Path) => void,
  onToggle?: (path: Path, isExpanded: boolean) => void,
  checkForUpdate: (gav: GAV) => void
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
    checkForUpdate: (gav: any) => dispatch(checkForUpdates(gav))
  }
}

export default connect(mapStateToProps, mapDispatch)(DependenciesTree)

