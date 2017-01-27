//@flow

import {addFile} from "../../tree/actions";

import type {Dispatch} from '../../../types/types'

export const CHANGE_FRAGMENT = 'newFile/CHANGE_FRAGMENT'
export const CHANGE_TYPE = 'newFile/CHANGE_TYPE'
export const CHANGE_NAME = 'newFile/CHANGE_NAME'
export const SHOW = 'newFile/SHOW_DIALOG'
export const HIDE = 'newFile/HIDE_DIALOG'

export const changeFileType = (type: string) => ({
  type: CHANGE_TYPE,
  payload: type
})

export const changeFragmentType = (type: string) => ({
  type: CHANGE_FRAGMENT,
  payload: type
})

export const changeName = (name: string) => ({
  type: CHANGE_NAME,
  payload: name
})

export const openNewFileDialog = () => ({
  type: SHOW
})

export const closeNewFileDialog = () => ({
  type: HIDE
})

export const add = (name: string, type: string) =>
  (dispatch: Dispatch) => {
    dispatch(addFile(name, type))
    dispatch(closeNewFileDialog())
  }

