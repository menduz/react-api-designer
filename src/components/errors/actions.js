import {actions as treeActions} from '../tree/index'
import {actions as editorActions} from '../editor/index'
import {Path} from '../../repository/index'
import type {Dispatch} from '../../types/types'

export const traceErrorSelected = (error) => {
  return (dispatch: Dispatch) => {
    dispatch(treeActions.pathSelected(Path.fromString(error.path)))
      .then(() => {
        dispatch(editorActions.setPosition(error.startLineNumber, error.startColumn))
      })
  }
}
