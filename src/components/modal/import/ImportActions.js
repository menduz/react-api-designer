//@flow

import request from "browser-request";
import {isRaml08, nextName} from "../../../repository/helper/utils";
import {addFile} from "../../tree/actions";
import {updateCurrentFile} from "../../editor/actions";
import type {Dispatch} from "../../../types/types";
import {getAll} from "./ImportSelectors";

export const HIDE = 'import/HIDE_DIALOG'
export const SHOW = 'import/SHOW_DIALOG'
export const CHANGE_TYPE = 'import/CHANGE_TYPE'
export const CHANGE_URL = 'import/CHANGE_URL'
export const FILE_UPLOAD = 'import/FILE_UPLOAD'
export const IMPORT_STARTED = 'import/IMPORT_STARTED'
export const IMPORT_DONE = 'import/IMPORT_DONE'

export const HIDE_CONFLICT_MODAL = 'import/HIDE_CONFLICT_MODAL'
export const SHOW_CONFLICT_MODAL = 'import/SHOW_CONFLICT_MODAL'
export const UPLOAD_TEMP_FILE = 'import/UPLOAD_TEMP_FILE'

export const showConflictDialog = () => ({
  type: SHOW_CONFLICT_MODAL
})

export const closeConflictDialog = () => ({
  type: HIDE_CONFLICT_MODAL
})

export const uploadTempFile = (fileName: string, type:string, content: any) => ({
  type: UPLOAD_TEMP_FILE,
  payload: {fileName, type, content}
})


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
  (dispatch: Dispatch, getState, {worker, repositoryContainer}: ExtraArgs) => {

    function convertFromUrl(url, fileType) {
      console.log('starting convertUrlToRaml ' + url)
      worker.convertUrlToRaml(url).then(c => {
        const urlName = url.substring(url.lastIndexOf('/') + 1, url.length)
        const fileName = nextName((urlName.endsWith(".yaml") || urlName.endsWith(".json"))?
        urlName.substring(0, urlName.length - 4) + 'raml':urlName, repositoryContainer)
        dispatch(addFile(fileName, fileType))
        setTimeout(() => {
          dispatch(updateCurrentFile(c))
          dispatch({type: IMPORT_DONE})
        }, 1000)
      }).catch(err => {
        //@@TODO Inform Error!
        console.error(err)
        dispatch({type: IMPORT_DONE})
      })
    }

    dispatch({type: IMPORT_STARTED})
    if (fileType === 'SWAGGER') {
      convertFromUrl(url, fileType)
    }
    else {
      const req = {
        method: 'GET',
        url: url
      }
      request(req, (err, response) => {
        if (err) {
          //@@TODO Inform Error!
          console.error(err)
          dispatch({type: IMPORT_DONE})
        }
        else {
          if (isRaml08(response.response)) {
            convertFromUrl(url, fileType)
          } else {
            const urlName = url.substring(url.lastIndexOf('/') + 1, url.length)
            const fileName = nextName((urlName.endsWith('.raml'))?urlName:urlName + '.raml', repositoryContainer)
            dispatch(addFile(fileName, fileType))
            setTimeout(() => {
              dispatch(updateCurrentFile(response.response))
              dispatch({type: IMPORT_DONE})
            }, 1000)
          }
        }
      })
    }
  }

export const importFile = (fileToImport: any, fileType: string) =>
  (dispatch: Dispatch, getState, {repositoryContainer}: ExtraArgs) => {
    dispatch({type: IMPORT_STARTED})

    const reader = new FileReader()
    const file = fileToImport.files[0]

    reader.onload = (upload) => {
      dispatch(uploadTempFile(file.name, fileType, upload.target.result))
      dispatch({type: HIDE})
      const repository: Repository = repositoryContainer.repository
      if (repository.getByPathString(file.name)) {
        dispatch(showConflictDialog())
      } else {
        saveFile()(dispatch, getState)
      }
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


export const saveFile = () => (dispatch: Dispatch, getState) => {
  const state = getAll(getState())
  dispatch(addFile(state.fileNameToImport, state.fileType))
  setTimeout(() => {
    dispatch(updateCurrentFile(state.fileToImport))
    dispatch({type: IMPORT_DONE})
  }, 1000)

}