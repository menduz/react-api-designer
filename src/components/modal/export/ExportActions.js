//@flow

import Repository from '../../../repository/Repository'

import {FILE_SAVE_FAILED, error} from "../../../repository-redux/actions"

import type {Dispatch, GetState, ExtraArgs} from '../../../types'
import findRamlRoot from '../../../repository/helper/ramlDefinition'

const fileDownload = require('react-file-download')

export const HIDE = 'DESIGNER/EXPORT/HIDE'
export const SHOW = 'DESIGNER/EXPORT/SHOW'
export const CHANGE_TYPE = 'DESIGNER/EXPORT/CHANGE_TYPE'
export const CHANGE_NAME = 'DESIGNER/EXPORT/CHANGE_NAME'
export const EXPORT_FAILED = 'DESIGNER/EXPORT/EXPORT_FAILED'
export const EXPORT_DONE = 'DESIGNER/EXPORT/EXPORT_DONE'
export const EXPORT_STARTED = 'DESIGNER/EXPORT/EXPORT_STARTED'

const REPOSITORY_NOT_LOADED = 'Repository not loaded!'

export const closeExportDialog = () => ({
  type: HIDE
})

export const exportAll = (name: string, type: string) =>
  (dispatch: Dispatch, getState: GetState, {designerWorker, repositoryContainer}: ExtraArgs) => {
    if (!repositoryContainer.isLoaded)
      return Promise.reject(dispatch(error(FILE_SAVE_FAILED, REPOSITORY_NOT_LOADED)))

    const repository: Repository = repositoryContainer.repository

    if (type === 'zip') {

      dispatch({type: EXPORT_STARTED})
      return repository.buildZip()
        .then(
          (content) => {
            const extension = '.' + type;
            const n = name.endsWith(extension) ? name : name + extension
            fileDownload(content, n)
            dispatch({type: EXPORT_DONE})
          }).catch(err => {
            console.error(err)
            dispatch(error(EXPORT_FAILED, 'Cannot export zip file'))
          }
        )
    }
    else {

      return findRamlRoot(repository).then(rootPath => {
        return designerWorker.convertToSwagger(
          rootPath,
          type
        ).then(
          (content) => {
            const extension = '.' + type;
            const n = name.endsWith(extension) ? name : name + extension
            const c = (type === 'json')? JSON.stringify(content):content
            fileDownload(c, n)
            dispatch({type: EXPORT_DONE})
          }).catch(err => {
            console.error(err)
            dispatch(error(EXPORT_FAILED, 'Cannot export to swagger'))
          }
        ).catch(err => {
          console.error(err)
          dispatch(error(EXPORT_FAILED, 'Cannot export to swagger'))
        })
      })
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
