//@flow

import {addFile} from "../../tree/actions";
import type {FileType} from './NewFileModel'
import type {Dispatch, GetState, ExtraArgs} from '../../../types/types'
import {nextName} from '../../../repository/helper/utils'

export const CHANGE_FRAGMENT = 'newFile/CHANGE_FRAGMENT'
export const CHANGE_TYPE = 'newFile/CHANGE_TYPE'
export const CHANGE_NAME = 'newFile/CHANGE_NAME'
export const SHOW = 'newFile/SHOW_DIALOG'
export const HIDE = 'newFile/HIDE_DIALOG'


export const changeFileType = (type: FileType) => (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs) => {
  dispatch({
    type: CHANGE_TYPE,
    payload: {
      type: type,
      fileName: nextName(type.defaultName, repositoryContainer)
    }
  })
}

export const changeFragmentType = (type: FileType) => (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs) => {
  dispatch({
    type: CHANGE_FRAGMENT,
    payload: {
      type: type,
      fileName: nextName(type.defaultName, repositoryContainer)
    }
  })
}

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

export const add = (name: string, type:? string) =>
  (dispatch: Dispatch) => {
    dispatch(addFile(name, type))
    dispatch(closeNewFileDialog())
  }

