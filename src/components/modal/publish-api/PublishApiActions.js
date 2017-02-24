// @flow

export const CLEAR = 'publishApi/CLEAR'
export const OPEN = 'publishApi/OPEN'
export const CHANGE_VALUE = 'publishApi/CHANGE_VALUE'
export const START_FETCHING = 'publishApi/START_LOADING'
export const SUCCESSFULLY_FETCH = 'publishApi/SUCCESSFULLY_FETCH'
export const PUBLISH_ERROR = 'publishApi/PUBLISH_ERROR'
export const REMOVE_TAG = 'publishApi/REMOVE_TAG'
export const ADD_TAG = 'publishApi/ADD_TAG'
export const PUBLISH_BOTH_APIS = 'publishApi/PUBLISH_BOTH_APIS'

import PublishApiRemoteApi from "../../../vcs-api/PublishApiRemoteApi"
import type {PublishApiResponse} from "../../../vcs-api/PublishApiRemoteApi"
import type {XApiDataProvider} from "../../../vcs-api/XApiDataProvider"
import * as constants from './PublishApiConstants'

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

export const successfullyFetched = (response: string, source: string) => ({
  type: SUCCESSFULLY_FETCH,
  payload: {response, source}
})

export const errorOnPublish = (error: string, source: string) => ({
  type: PUBLISH_ERROR,
  payload: {error, source}
})

export const removeTag = (tag: string) => ({
  type: REMOVE_TAG,
  payload: {tag}
})

export const addTag = (tag: string) => ({
  type: ADD_TAG,
  payload: {tag}
})

export const togglePublishBothApis = (publishBoth: boolean) => ({
  type: PUBLISH_BOTH_APIS,
  payload: {publishBoth}
})

type Dispatch = (a: any) => void

export const openModal = () => {
  return (dispatch: Dispatch, getState, {dataProvider}: XApiDataProvider) => {
    const remoteApi = new PublishApiRemoteApi(dataProvider)
    remoteApi.getLastVersion()
      .then((lastVersion) => {
        Object.keys(lastVersion).forEach((key) => {
          dispatch(changeValue(key, lastVersion[key]))
        })
        dispatch({type: OPEN})
      })
      .catch((error) => {
        console.log("")
        dispatch({type: OPEN})
      })
  }
}

const formatErrorMessage = (error: any, source: string) => {
  return `An error has occurred while publishing in ${source}: ${error && error.body ? error.body.message + '. Status: ' + error.status : ''}`;
}

export const publish = (name: string, version: string, tags: Array<string>, mainFile: string,
                        assetId: string, groupId: string, platform: boolean, exchange: boolean) => {
  return (dispatch: Dispatch, getState, {dataProvider}: XApiDataProvider) => {
    dispatch(startFetching())
    const remoteApi = new PublishApiRemoteApi(dataProvider)

    if (platform) {
      //publishing to platform
      remoteApi.publishToPlatform(name, version, tags)
        .then((response: PublishApiResponse) => {
          dispatch(successfullyFetched(response, constants.PLATFORM))
        })
        .catch((error) => {
          console.error(error)
          dispatch(errorOnPublish(formatErrorMessage(error, constants.PLATFORM), constants.PLATFORM))
        })
    }

    if (exchange) {
      //publishing to exchange
      remoteApi.publishToExchange(name, version, tags, mainFile, assetId, groupId)
        .then((response: PublishApiResponse) => {
          dispatch(successfullyFetched(response.apiName, constants.EXCHANGE))
        })
        .catch((error) => {
          console.error(error)
          dispatch(errorOnPublish(formatErrorMessage(error, constants.EXCHANGE), constants.EXCHANGE))
        })
    }
  }
}