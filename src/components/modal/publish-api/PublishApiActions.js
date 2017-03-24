// @flow
export const CLEAR = 'DESIGNER/PUBLISHAPI/CLEAR'
export const OPEN = 'DESIGNER/PUBLISHAPI/OPEN'
export const CHANGE_VALUE = 'DESIGNER/PUBLISHAPI/CHANGE_VALUE'
export const START_FETCHING = 'DESIGNER/PUBLISHAPI/START_LOADING'
export const SUCCESSFULLY_FETCH = 'DESIGNER/PUBLISHAPI/SUCCESSFULLY_FETCH'
export const PUBLISH_ERROR = 'DESIGNER/PUBLISHAPI/PUBLISH_ERROR'
export const REMOVE_TAG = 'DESIGNER/PUBLISHAPI/REMOVE_TAG'
export const ADD_TAG = 'DESIGNER/PUBLISHAPI/ADD_TAG'
export const PUBLISH_BOTH_APIS = 'DESIGNER/PUBLISHAPI/PUBLISH_BOTH_APIS'
export const FINISH_LOADING = 'DESIGNER/PUBLISHAPI/FINISH_LOADING'

import type {GetState, ExtraArgs} from '../../../types'
import PublishRemoteApi from "../../../remote-api/PublishRemoteApi"
import type {PublishApiResponse} from "../../../remote-api/PublishRemoteApi"
import {getProjectType} from '../../../bootstrap/selectors'
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
    const authSelectors = designerRemoteApiSelectors(getState);
    const remoteApi = new PublishRemoteApi(authSelectors)
    remoteApi.exchange(authSelectors.organizationDomain())
      .then((exchangeProps) => {
        Object.keys(exchangeProps).forEach((key) => {
          dispatch(changeValue(key, exchangeProps[key]))
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
  return error && error.body && error.body.message ? error.body.message : `Connection error while publishing to ${source}`
}

export const publish = (name: string, version: string, tags: Array<string>, mainFile: string,
                        assetId: string, groupId: string, platform: boolean, exchange: boolean) => {
  return (dispatch: Dispatch, getState: GetState, {designerRemoteApiSelectors}: ExtraArgs) => {
    dispatch(startFetching(!platform && exchange ? constants.EXCHANGE : !exchange && platform ? constants.PLATFORM : constants.BOTH))

    const dataProvider = designerRemoteApiSelectors(getState)
    const remoteApi = new PublishRemoteApi(dataProvider)

    if (exchange) {
      //publishing to exchange
      const projectType = getProjectType(getState()) // raml or raml_fragment
      remoteApi.publishToExchange(name, version, tags, mainFile, assetId, groupId, projectType)
        .then((response) => {
          const url = `/exchange/${response.groupId}/${response.assetId}/${response.version}`
          dispatch(successfullyFetched({...response, url}, constants.EXCHANGE))
        })
        .catch((error) => {
          console.error(error)
          dispatch(errorOnPublish(formatErrorMessage(error, constants.EXCHANGE), constants.EXCHANGE))
        })
    }

    if (platform) {
      //publishing to platform
      remoteApi.publishToPlatform(name, version, tags, mainFile)
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