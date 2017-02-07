//@flow

import {rename} from '../../../repository-redux/actions'

export const CHANGE_NAME = 'renameElement/CHANGE_NAME'
export const SHOW = 'renameElement/SHOW_DIALOG'
export const HIDE = 'renameElement/HIDE_DIALOG'

export const changeName = (name: string) => ({
  type: CHANGE_NAME,
  payload: name
})

export const openRenameDialog = (oldName: string) => ({
  type: SHOW,
  payload: oldName
})

export const closeRenameDialog = () => ({
  type: HIDE
})

export const renameWith = (oldName: string, newName: string) =>
  (dispatch) => {
    dispatch(rename(oldName, newName))
    dispatch(closeRenameDialog())
  }
