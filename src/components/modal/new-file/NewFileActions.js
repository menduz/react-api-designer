//@flow

import {addFile} from "../../tree/actions";
import type {FileType} from './NewFileModel'
import type {Dispatch, GetState, ExtraArgs} from '../../../types'
import {nextName} from '../../../repository/helper/utils'
import {Path} from '../../../repository'

export const CHANGE_FRAGMENT = 'DESIGNER/NEWFILE/CHANGE_FRAGMENT'
export const CHANGE_TYPE = 'DESIGNER/NEWFILE/CHANGE_TYPE'
export const CHANGE_NAME = 'DESIGNER/NEWFILE/CHANGE_NAME'
export const SHOW = 'DESIGNER/NEWFILE/SHOW_DIALOG'
export const HIDE = 'DESIGNER/NEWFILE/HIDE_DIALOG'


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

export const openNewFileDialog = (path: ?Path) =>(dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs) => {
  dispatch({
    type: SHOW,
    payload: {
      nextName: nextName('api.raml', repositoryContainer, path),
      path
    }
  })
}

export const closeNewFileDialog = () => ({
  type: HIDE
})

export const add = (name: string, type:? string, path: ?Path) =>
  (dispatch: Dispatch) => {
    const currentPath = path ? path : Path.emptyPath(true)
    dispatch(addFile(name, type, currentPath))
    dispatch(closeNewFileDialog())
  }

