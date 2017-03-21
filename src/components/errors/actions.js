import {actions as treeActions} from '../tree/index'
import {actions as editorActions} from '../editor/index'
import {Path} from '../../repository/index'
import type {Dispatch, GetState} from '../../types'
import {selectors} from '../tree'

const goToPosition = (dispatch, error) => {
  dispatch(editorActions.setPosition(error.startLineNumber, error.startColumn))
}

export const goToError = (error) => {
  return (dispatch: Dispatch, getState: GetState) => {
    const currentPath = selectors.getAll(getState()).currentPath.toString()
    if (error.path && currentPath && !currentPath.includes(error.path)) {
      const path = Path.mergePath(Path.fromString(currentPath).parent(), Path.fromString(error.path))
      dispatch(treeActions.pathSelected(path)).then(() => goToPosition(dispatch, error))
    }
    else
      goToPosition(dispatch, error)
  }
}
