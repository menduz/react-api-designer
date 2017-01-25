//@flow

import request from "browser-request"

import {addFile} from '../../tree/actions'
import {updateCurrentFile} from '../../editor/actions'

import {Repository} from '../../../repository'

type GetState = () => {[key: string]: any}
type ExtraArgs = {repositoryContainer: {repository: Repository}}
type Action = {type: any} | (d: Dispatch, gS: GetState, eA: ExtraArgs) => void
type Dispatch = (action: Action) => void

export const HIDE = 'import/HIDE_DIALOG'
export const SHOW = 'import/SHOW_DIALOG'
export const CHANGE_TYPE = 'import/CHANGE_TYPE'
export const CHANGE_URL = 'import/CHANGE_URL'
export const FILE_UPLOAD = 'import/FILE_UPLOAD'
export const IMPORT_STARTED = 'import/IMPORT_STARTED'
export const IMPORT_DONE = 'import/IMPORT_DONE'

export const closeImportDialog = () => ({
  type: HIDE
})

export const changeType = (type: string) => ({
  type: CHANGE_TYPE,
  payload: {type}
})

export const changeUrl = (url: string) => ({
  type: CHANGE_URL,
  payload: {url}
})

export const openImportDialog = () => ({
  type: SHOW
})

export const uploadFile = (event: any) => ({
  type: FILE_UPLOAD,
  payload: {event}
})

export const importFileFromUrl = (url: string, fileType: string) =>
  (dispatch: Dispatch) => {
    const req = {
      method: 'GET',
      url: url
    }

    dispatch({type: IMPORT_STARTED})
    request(req, (err, response) => {
      if (err) {}
      else {
        const fileName = url.substring(url.lastIndexOf('/') + 1, url.length)

        dispatch(addFile(fileName, fileType))
        setTimeout(() => {
          dispatch(updateCurrentFile(response.response))
          dispatch({type: IMPORT_DONE})
        }, 1000)
      }
    })

  }

export const importFile = (fileToImport: any, fileType: string) =>
  (dispatch: Dispatch) => {
    dispatch({type: IMPORT_STARTED})

    const reader = new FileReader()
    const file = fileToImport.files[0]

    reader.onload = (upload) => {
      dispatch(addFile(file.name, fileType))
      setTimeout(() => {
        dispatch(updateCurrentFile(upload.target.result))
        dispatch({type: IMPORT_DONE})
      }, 1000)
    }

    if (isZip(file)) {
      reader.readAsArrayBuffer(file)
    } else {
      reader.readAsText(file)
    }
  }

const isZip = (file) => {
  return (/\.zip$/i).test(file.name)
}
