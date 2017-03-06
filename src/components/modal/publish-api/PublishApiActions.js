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
export const FINISH_LOADING = 'publishApi/FINISH_LOADING'

import type {GetState, ExtraArgs} from '../../../types'
import PublishRemoteApi from "../../../remote-api/PublishRemoteApi"
import type {PublishApiResponse} from "../../../remote-api/PublishRemoteApi"
import * as constants from './PublishApiConstants'

export const clear = () => ({
  type: CLEAR
})

export const finishLoading = () => ({
  type: FINISH_LOADING
})

export const changeValue = (name: string, value: string) => ({
  type: CHANGE_VALUE,
  payload: {name, value}
})

export const startFetching = (source: string) => ({
  type: START_FETCHING,
  payload: {source}
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
  return (dispatch: Dispatch, getState: GetState, {designerRemoteApiSelectors}: ExtraArgs) => {
    const remoteApi = new PublishRemoteApi(designerRemoteApiSelectors(getState))
    remoteApi.getLastVersion()
      .then((lastVersion) => {
        Object.keys(lastVersion).forEach((key) => {
          dispatch(changeValue(key, lastVersion[key]))
        })
        dispatch(finishLoading())
      })
      .catch((error) => {
        dispatch(errorOnPublish(error ? error.msg ? error.msg : error : 'An error occurred while getting the last version', ''))
        dispatch(finishLoading())
      })
      dispatch({type: OPEN})
  }
}

const formatErrorMessage = (error: any, source: string) => {
  return `An error has occurred while publishing to ${source}: ${error && error.body ? error.body.message + '. Status: ' + error.status : ''}`
}

export const publish = (name: string, version: string, tags: Array<string>, mainFile: string,
                        assetId: string, groupId: string, platform: boolean, exchange: boolean) => {
  return (dispatch: Dispatch, getState: GetState, {designerRemoteApiSelectors}: ExtraArgs) => {
    dispatch(startFetching(!platform && exchange ? constants.EXCHANGE : !exchange && platform ? constants.PLATFORM : constants.BOTH))

    const dataProvider = designerRemoteApiSelectors(getState)
    const remoteApi = new PublishRemoteApi(dataProvider)

    if (exchange) {
      //publishing to exchange
      remoteApi.publishToExchange(name, version, tags, mainFile, assetId, groupId)
        .then((response: PublishApiResponse) => {
          dispatch(successfullyFetched(response, constants.EXCHANGE))
        })
        .catch((error) => {
          console.error(error)
          dispatch(errorOnPublish(formatErrorMessage(error, constants.EXCHANGE), constants.EXCHANGE))
        })
    }

    if (platform) {
      //publishing to platform
      remoteApi.publishToPlatform(name, version, tags)
        .then((response: PublishApiResponse) => {
          const url = `/apiplatform/${dataProvider.organizationDomain()}/admin/#/organizations/${dataProvider.organizationId()}/dashboard/apis/${response.apiId}/versions/${response.versionId}`
          dispatch(successfullyFetched({...response, url}, constants.PLATFORM))
        })
        .catch((error) => {
          console.error(error)
          dispatch(errorOnPublish(formatErrorMessage(error, constants.PLATFORM), constants.PLATFORM))
        })
    }
  }
}