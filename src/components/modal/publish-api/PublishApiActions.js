// @flow

export const CLEAR = 'publishApi/CLEAR'
export const OPEN = 'publishApi/OPEN'
export const CHANGE_VALUE = 'publishApi/CHANGE_VALUE'
export const START_FETCHING = 'publishApi/START_LOADING'
export const SUCCESSFULLY_FETCH = 'publishApi/SUCCESSFULLY_FETCH'
export const PUBLISH_ERROR = 'publishApi/PUBLISH_ERROR'
export const REMOVE_TAG = 'publishApi/REMOVE_TAG'
export const ADD_TAG = 'publishApi/ADD_TAG'

import type {GetState, ExtraArgs} from '../../../types/types'
import PublishApiRemoteApi from "../../../vcs-api/PublishApiRemoteApi"
import type {PublishApiResponse} from "../../../vcs-api/PublishApiRemoteApi"

export const openModal = () => ({
  type: OPEN
})

export const clear = () => ({
  type: CLEAR
})

export const changeValue = (name: string, value: string) => ({
  type: CHANGE_VALUE,
  payload: {name, value}
})

export const startFetching = () => ({
  type: START_FETCHING
})

export const successfullyFetched = (link: string) => ({
  type: SUCCESSFULLY_FETCH,
  payload: {link}
})

export const errorOnPublish = (error: string) => ({
  type: PUBLISH_ERROR,
  payload: {error}
})

export const removeTag = (tag: string) => ({
  type: REMOVE_TAG,
  payload: {tag}
})

export const addTag = (tag: string) => ({
  type: ADD_TAG,
  payload: {tag}
})

type Dispatch = (a: any) => void

export const publish = (name: string, version: string, tags: Array<string>) =>
  (dispatch: Dispatch, getState: GetState, {contextProvider}: ExtraArgs) => {
    dispatch(startFetching())

    const remoteApi = new PublishApiRemoteApi(contextProvider)
    remoteApi.createVersion(name, version, tags)
      .then((response: PublishApiResponse) => {
        dispatch(successfullyFetched(response.apiName))
      }).catch((error) => {
        console.error(error)
        dispatch(errorOnPublish('An error has occurred while publishing.'))
      })
  }
