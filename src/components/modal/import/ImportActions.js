import request from "browser-request"
import {nextName} from "../../../repository/helper/utils"
import {addFile} from "../../tree/actions"
import {updateCurrentFile} from "../../editor/actions"
import {getAll} from "./ImportSelectors"
import ZipHelper from "../../../repository/helper/ZipHelper"
import Repository from "../../../repository/Repository"
import {addBulkFiles} from "../../../repository-redux/actions"
import {actions as repositoryActions} from "../../../repository-redux"
import {File} from '../../../repository'
import type {Dispatch, ExtraArgs, GetState} from '../../../types'

export const HIDE = 'DESIGNER/IMPORT/HIDE_DIALOG'
export const SHOW = 'DESIGNER/IMPORT/SHOW_DIALOG'
export const CHANGE_TYPE = 'DESIGNER/IMPORT/CHANGE_TYPE'
export const CHANGE_URL = 'DESIGNER/IMPORT/CHANGE_URL'
export const FILE_UPLOAD = 'DESIGNER/IMPORT/FILE_UPLOAD'
export const IMPORT_STARTED = 'DESIGNER/IMPORT/IMPORT_STARTED'
export const IMPORT_DONE = 'DESIGNER/IMPORT/IMPORT_DONE'
export const CHANGE_ERROR = 'DESIGNER/IMPORT/CHANGE_ERROR'

export const HIDE_CONFLICT_MODAL = 'DESIGNER/IMPORT/HIDE_CONFLICT_MODAL'
export const SHOW_CONFLICT_MODAL = 'DESIGNER/IMPORT/SHOW_CONFLICT_MODAL'
export const UPLOAD_TEMP_FILE = 'DESIGNER/IMPORT/UPLOAD_TEMP_FILE'

export const HIDE_ZIP_CONFLICT_MODAL = 'DESIGNER/IMPORT/HIDE_ZIP_CONFLICT_MODAL'
export const SHOW_ZIP_CONFLICT_MODAL = 'DESIGNER/IMPORT/SHOW_ZIP_CONFLICT_MODAL'

export const ADD_ZIP_FILES = 'DESIGNER/IMPORT/ADD_ZIP_FILES'

export const ZIP_FILE_OVERRIDE_ACTION = 'DESIGNER/IMPORT/ZIP_FILE_OVERRIDE_ACTION'

const SWAGGER = 'SWAGGER'

export const showConflictDialog = () => ({
  type: SHOW_CONFLICT_MODAL
})

export const closeConflictDialog = () => ({
  type: HIDE_CONFLICT_MODAL
})

export const showZipConflictDialog = () => ({
  type: SHOW_ZIP_CONFLICT_MODAL
})

export const closeZipConflictDialog = () => ({
  type: HIDE_ZIP_CONFLICT_MODAL
})

export const zipFileOverrideAction = (filename: string, override) => ({
  type: ZIP_FILE_OVERRIDE_ACTION,
  payload: {filename, override}
})

export const addZipFiles = (zipFiles) => ({
  type: ADD_ZIP_FILES,
  payload: {zipFiles}
})

export const uploadTempFile = (fileName: string, type: string, content: any) => ({
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

export const openImportDialog = (file?: any) => ({
  type: SHOW,
  payload: {file}
})

export const uploadFile = (event: any) => ({
  type: FILE_UPLOAD,
  payload: {event}
})

export const changeError = (error: any) => ({
  type: CHANGE_ERROR,
  payload: {error: error.message || error}
})

const nameFromUrl = (url) => {
  return url.substring(url.lastIndexOf('/') + 1, url.length)
}

const toRamlName = (name, repositoryContainer) => {
  const resultName = (name.endsWith(".yaml") || name.endsWith(".json")) ?
    name.substring(0, name.length - 4) + 'raml' : name;
  if (!repositoryContainer) {
    return resultName
  } else {
    return nextName(resultName, repositoryContainer)
  }
}

const addAndSaveFile = (fileName: string, fileType, content, dispatch: Dispatch) => {
  dispatch(addFile(fileName, fileType))
    .then((file: File) => {
      dispatch(updateCurrentFile(content))
      dispatch(repositoryActions.saveFile(file.path))
      dispatch({type: IMPORT_DONE})
    })
    .catch((error) => {
      dispatch(changeError(error))
    })
}

export const importFileFromUrl = (url: string, fileType: string) =>
  (dispatch: Dispatch, getState: GetState, {designerWorker, repositoryContainer, designerRemoteApiSelectors}: ExtraArgs) => {

    const proxy = designerRemoteApiSelectors(getState).baseUrl() + '/proxy/'

    dispatch({type: IMPORT_STARTED})
    if (fileType === 'SWAGGER') {
      designerWorker.convertUrlToRaml(proxy + url).then(c => {
        const fileName = toRamlName(nameFromUrl(url), repositoryContainer)
        addAndSaveFile(fileName, fileType, c, dispatch)
      }).catch(err => {
        dispatch(changeError(err))
      })
    }
    else {
      request({ method: 'GET', url: proxy + url}, (err, response) => {
        if (err)
          dispatch(changeError(err))
        else {
          const fileName = nextName(nameFromUrl(url), repositoryContainer)
          addAndSaveFile(fileName, fileType, response.response, dispatch)
        }
      })
    }
  }

const isZip = (file) => {
  return (/\.zip$/i).test(file.name)
}

export const saveZipFiles = () => (dispatch: Dispatch, getState: GetState) => {
  const state = getAll(getState())
  const zipFiles = state.zipFiles
  const files = zipFiles.filter(f => f.override)
  ZipHelper.filesContents(state.fileToImport, files).then(contents => {
    dispatch(addBulkFiles(contents))
      .then(() => {
        dispatch({type: IMPORT_DONE})
      })
  })
}

export const saveFile = () => (dispatch: Dispatch, getState: GetState) => {
  const state = getAll(getState())
  addAndSaveFile(state.fileNameToImport, state.fileType, state.fileToImport, dispatch)
}

const convertSwaggerToRaml = (files, designerWorker, dispatch: Dispatch) => {
  designerWorker.convertSwaggerToRaml(files).then(result => {
    const fileName = toRamlName(result.filename)
    const filtered = files.filter(c => c.filename !== result.filename)

    filtered.push({filename: fileName, content: result.content, override: true})
    dispatch(addBulkFiles(filtered)).then(() => {
      dispatch({type: IMPORT_DONE})
    })
  }).catch(err => {
    dispatch(changeError(err))
  })
}

export const importFile = (file: any, fileType: string) =>
  (dispatch: Dispatch, getState: GetState, {designerWorker, repositoryContainer}: ExtraArgs) => {
    dispatch({type: IMPORT_STARTED})

    const reader = new FileReader()
    const zip = isZip(file)
    const repository: Repository = repositoryContainer.repository

    reader.onload = (upload) => {
      dispatch(uploadTempFile(file.name, fileType, upload.target.result))
      if (zip) {
        if (fileType === SWAGGER) {
          dispatch({type: IMPORT_STARTED})
          ZipHelper.filesContents(upload.target.result).then(files => {
            convertSwaggerToRaml(files, designerWorker, dispatch)
          }).catch(err => {
            dispatch(changeError(err))
          })
        } else {
          ZipHelper.listZipFiles(repository, upload.target.result).then(files => {
            dispatch(addZipFiles(files))
            const conflicts = files.filter(f => f.conflict)

            if (conflicts.length > 0)
              dispatch(showZipConflictDialog())
            else
              dispatch(saveZipFiles())
          })
        }
      } else {
        if (fileType === SWAGGER) {
          const files = [{filename: file.name, content: upload.target.result}]
          convertSwaggerToRaml(files, designerWorker, dispatch)
        } else {
          if (repository.getByPathString(file.name))
            dispatch(showConflictDialog())
          else
            dispatch(saveFile())
        }
      }
    }

    if (zip)
      reader.readAsArrayBuffer(file)
    else
      reader.readAsText(file)
  }