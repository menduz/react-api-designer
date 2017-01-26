//@flow

import Repository from '../../../repository/Repository'

import {FILE_SAVE_FAILED, error} from "../../../repository-redux/actions"

const fileDownload = require('react-file-download')

type ExtraArgs = {repositoryContainer: {repository: Repository}}
type GetState = () => {[key: string]: any}
type Action = {type: any} | (d: Dispatch, gS: GetState, eA: ExtraArgs) => void
type Dispatch = (action: Action) => void

export const HIDE = 'export/HIDE'
export const SHOW = 'export/SHOW'
export const CHANGE_TYPE = 'export/CHANGE_TYPE'
export const CHANGE_NAME = 'export/CHANGE_NAME'
export const EXPORT_ZIP_FAILED = 'export/EXPORT_ZIP_FAILED'
export const EXPORT_ZIP_DONE = 'export/EXPORT_ZIP_DONE'
export const EXPORT_ZIP_STARTED = 'export/EXPORT_ZIP_STARTED'

const REPOSITORY_NOT_LOADED = 'Repository not loaded!'

export const closeExportDialog = () => ({
  type: HIDE
})

export const exportAll = (name: string, type: string) =>
  (dispatch: Dispatch, getState: GetState, {repositoryContainer}: ExtraArgs) => {
    if (type === 'zip') {
      if (!repositoryContainer.isLoaded)
        return Promise.reject(dispatch(error(FILE_SAVE_FAILED, REPOSITORY_NOT_LOADED)))

      const repository: Repository = repositoryContainer.repository

      dispatch({type: EXPORT_ZIP_STARTED})
      return repository.buildZip()
        .then(
          (content) => {
            const extension = '.' + type;
            const n = name.endsWith(extension)?name:name + extension
            fileDownload(content, n)
            dispatch({type: EXPORT_ZIP_DONE})
          }).catch(err => {
            console.error(err)
            dispatch(error(EXPORT_ZIP_FAILED, 'Error on export to zip'))
          }
        )
    }
    else {
      dispatch(closeExportDialog())
    }
  }

export const openExportDialog = () => ({
  type: SHOW
})

export const changeType = (type: string) => ({
  type: CHANGE_TYPE,
  payload: {type}
})

export const changeName = (name: string) => ({
  type: CHANGE_NAME,
  payload: {name}
})
