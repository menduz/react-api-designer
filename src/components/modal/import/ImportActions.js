//@flow

import request from "browser-request";
import {nextName} from "../../../repository/helper/utils";
import {isApiDefinition} from "../../../repository/helper/extensions";
import {addFile} from "../../tree/actions";
import {updateCurrentFile} from "../../editor/actions";
import type {Dispatch} from "../../../types/types";
import {getAll} from "./ImportSelectors";
import ZipHelper from "../../../repository/helper/ZipHelper"
import Repository from "../../../repository/Repository"
import {addBulkFiles} from "../../../repository-redux/actions"

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

export const HIDE_ZIP_CONFLICT_MODAL = 'import/HIDE_ZIP_CONFLICT_MODAL'
export const SHOW_ZIP_CONFLICT_MODAL = 'import/SHOW_ZIP_CONFLICT_MODAL'

export const ADD_ZIP_FILES = 'import/ADD_ZIP_FILES'

export const ZIP_FILE_OVERRIDE_ACTION = 'import/ZIP_FILE_OVERRIDE_ACTION'

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

export const zipFileOverrideAction = (filename, override) => ({
  type: ZIP_FILE_OVERRIDE_ACTION,
  payload: {filename, override}
})

export const addZipFiles = (zipFiles) => ({
  type: ADD_ZIP_FILES,
  payload: {zipFiles}
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

export const openImportDialog = (file?: any) => ({
  type: SHOW,
  payload: {file}
})

export const uploadFile = (event: any) => ({
  type: FILE_UPLOAD,
  payload: {event}
})

function nameFromUrl(url) {
  return url.substring(url.lastIndexOf('/') + 1, url.length)
}

function toRamlName(name, repositoryContainer) {
  return nextName((name.endsWith(".yaml") || name.endsWith(".json"))?
  name.substring(0, name.length - 4) + 'raml':name, repositoryContainer)
}

export const importFileFromUrl = (url: string, fileType: string) =>
  (dispatch: Dispatch, getState, {worker, repositoryContainer}: ExtraArgs) => {


    function convertFromUrl(url, fileType, baseName) {
      worker.convertUrlToRaml(url).then(c => {
        const fileName = baseName(nameFromUrl(url), repositoryContainer)
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
      convertFromUrl(url, fileType, toRamlName)
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
          if (isApiDefinition(response.response)) {
            function baseName(name, repositoryContainer) {
              return nextName(name.endsWith('.raml')?name:name + '.raml', repositoryContainer)
            }
            convertFromUrl(url, fileType, baseName)
          } else {
            const fileName = nextName(nameFromUrl(url), repositoryContainer)
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

export const importFile = (file: any, fileType: string) =>
  (dispatch: Dispatch, getState, {worker, repositoryContainer}: ExtraArgs) => {
    dispatch({type: IMPORT_STARTED})


    function convertSwaggerToRaml(files) {
      worker.convertSwaggerToRaml(files).then(result => {
        const fileName  = toRamlName(nameFromUrl(result.filename), repositoryContainer)
        dispatch(addFile(fileName, fileType))
        setTimeout(() => {
          dispatch(updateCurrentFile(result.content))
          dispatch({type: IMPORT_DONE})
        }, 1000)
      }).catch(err => {
        //@@TODO Manage Error
        console.error(err)
        dispatch({type: IMPORT_DONE})
      })
    }

    const reader = new FileReader()
    const zip = isZip(file);
    const repository: Repository = repositoryContainer.repository

    reader.onload = (upload) => {
      dispatch(uploadTempFile(file.name, fileType, upload.target.result))
      if (zip) {
        if (fileType === SWAGGER) {
          dispatch({type: IMPORT_STARTED})
          ZipHelper.filesContents(upload.target.result).then(files => {
            convertSwaggerToRaml(files)
          }).catch(err => {
            //@@TODO Manage Error
            console.error(err)
            dispatch({type: IMPORT_DONE})
          })
        } else {
          ZipHelper.listZipFiles(repository, upload.target.result).then(files => {
            dispatch(addZipFiles(files))
            const conflicts = files.filter(f => {
              return f.conflict
            })

            if (conflicts.length > 0) {
              dispatch(showZipConflictDialog())
            } else {
              saveZipFiles()(dispatch, getState, {repositoryContainer})
            }
          })
        }
      } else {
        if (fileType === SWAGGER) {
          const files = [{filename:file.name, content:upload.target.result}]
          convertSwaggerToRaml(files)
        } else {
          if (repository.getByPathString(file.name)) {
            dispatch(showConflictDialog())
          } else {
            saveFile()(dispatch, getState)
          }
        }
      }
    }

    if (zip) {
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

export const saveZipFiles = () => (dispatch:Dispatch, getState, {repositoryContainer}: ExtraArgs) => {
  const state = getAll(getState())
  const zipFiles = state.zipFiles
  const files = (zipFiles.filter(f => {return f.override}))
  ZipHelper.filesContents(state.fileToImport, files).then(contents => {
    addBulkFiles(contents)(dispatch, getState, {repositoryContainer})
    //dispatch({type: IMPORT_DONE})
  })
}