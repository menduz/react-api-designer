import {actions as treeActions} from '../tree/index'
import {actions as editorActions} from '../editor/index'
import {Path} from '../../repository/index'
import type {Dispatch} from '../../types/types'

const goToPosition = (dispatch, error) => {
  dispatch(editorActions.setPosition(error.startLineNumber, error.startColumn))
}

export const goToError = (error) => {
  return (dispatch: Dispatch) => {
    if (error.path) {
      dispatch(treeActions.pathSelected(Path.fromString(error.path))).then(() => goToPosition(dispatch, error))
    } else {
      goToPosition(dispatch, error)
    }
  }
}
