//@flow

import Repository from '../../../repository/Repository'

import {FILE_SAVE_FAILED, error} from "../../../repository-redux/actions"

import type {Dispatch, GetState, ExtraArgs} from '../../../types'
import findRamlRoot from '../../../repository/helper/ramlDefinition'

const fileDownload = require('react-file-download')

export const HIDE = 'export/HIDE'
export const SHOW = 'export/SHOW'
export const CHANGE_TYPE = 'export/CHANGE_TYPE'
export const CHANGE_NAME = 'export/CHANGE_NAME'
export const EXPORT_FAILED = 'export/EXPORT_FAILED'
export const EXPORT_DONE = 'export/EXPORT_DONE'
export const EXPORT_STARTED = 'export/EXPORT_STARTED'

const REPOSITORY_NOT_LOADED = 'Repository not loaded!'

export const closeExportDialog = () => ({
  type: HIDE
})

export const exportAll = (name: string, type: string) =>
  (dispatch: Dispatch, getState: GetState, {worker, repositoryContainer}: ExtraArgs) => {
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
        return worker.convertToSwagger(
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
