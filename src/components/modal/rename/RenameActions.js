//@flow

import {rename} from '../../../repository-redux/actions'
import Path from '../../../repository/Path'

import type {Dispatch} from '../../../types'

export const CHANGE_NAME = 'DESIGNER/RENAME/CHANGE_NAME'
export const SHOW = 'DESIGNER/RENAME/SHOW_DIALOG'
export const HIDE = 'DESIGNER/RENAME/HIDE_DIALOG'

export const changeName = (name: string) => ({
  type: CHANGE_NAME,
  payload: name
})

export const openRenameDialog = (path: Path) => ({
  type: SHOW,
  payload: path
})

export const closeRenameDialog = () => ({
  type: HIDE
})

export const renameWith = (path: Path, newName: string) =>
  (dispatch: Dispatch) => {
    dispatch(rename(path, newName))
    dispatch(closeRenameDialog())
  }
