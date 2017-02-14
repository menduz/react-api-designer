//@flow

import {rename} from '../../../repository-redux/actions'

export const CHANGE_NAME = 'renameElement/CHANGE_NAME'
export const SHOW = 'renameElement/SHOW_DIALOG'
export const HIDE = 'renameElement/HIDE_DIALOG'

export const changeName = (name: string) => ({
  type: CHANGE_NAME,
  payload: name
})

export const openRenameDialog = (path: string) => ({
  type: SHOW,
  payload: path
})

export const closeRenameDialog = () => ({
  type: HIDE
})

export const renameWith = (path: string, newName: string) =>
  (dispatch) => {
    dispatch(rename(path, newName))
    dispatch(closeRenameDialog())
  }
