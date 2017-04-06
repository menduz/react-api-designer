// @flow

import versionCmp from 'semver'
import ConsumeRemoteApi from '../../../remote-api/ConsumeRemoteApi'
import type {ConsumeResponse} from '../../../remote-api/ConsumeRemoteApi'
import type {ExtraArgs, Dispatch, GetState} from '../../../types/index'
import {Fragment} from '../consume-api/Fragment'
import {getFragment, getCurrentGAV} from './DependencySelectors'
import type {GAV} from './DependencyModel'
import {addExchangeDependency} from '../../dependencies-tree/actions'
import {List} from 'immutable'

export const OPEN_MODAL = 'DESIGNER/DEPENDENCY/OPEN_MODAL'
export const CLEAR = 'DESIGNER/DEPENDENCY/CLEAR'
export const ERROR = 'DESIGNER/DEPENDENCY/ERROR'
export const IS_SEARCHING = 'DESIGNER/DEPENDENCY/IS_SEARCHING'
export const ADD_FRAGMENT = 'DESIGNER/DEPENDENCY/ADD_FRAGMENT'

export const openModal = (currentGav: GAV) => ({
  type: OPEN_MODAL,
  payload: currentGav
})

export const clear = () => ({
  type: CLEAR
})

export const addFragment = (fragment: $Shape<Fragment>, canUpdate: boolean) => ({
  type: ADD_FRAGMENT,
  payload: {
    fragment,
    canUpdate
  }
})

export const showError = (errorMsg: string) => ({
  type: ERROR,
  payload: errorMsg
})

export const isSearching = (isSearching: boolean) => ({
  type: IS_SEARCHING,
  payload: isSearching
})

export const updateDependency = () => {
  return (dispatch: Dispatch, getState: GetState): void => {
    const fragment: Fragment = getFragment(getState())
    const {groupId, assetId, version} = fragment
    dispatch(addExchangeDependency(List.of({groupId, assetId, version}), List.of(getCurrentGAV(getState()))))
    dispatch(clear())
  }
}

export const checkForUpdates = (gav: GAV) => {
  return (dispatch: Dispatch, getState: GetState, {designerRemoteApiSelectors}: ExtraArgs): void => {
    dispatch(openModal(gav))
    const consumeRemoteApi = new ConsumeRemoteApi(designerRemoteApiSelectors(getState))
    consumeRemoteApi.getLatestVersion(gav.groupId, gav.assetId)
      .then((response: ConsumeResponse) => {
        const {assets} = response.data
        if (assets.length !== 0) {
          const latestVersion: $Shape<Fragment> = assets[0]
          dispatch(addFragment(latestVersion, versionCmp.compare(latestVersion.version, gav.version) > 0))
        } else {
          dispatch(showError('Something happened with the version verification, please try again'))
        }
      })
      .catch((error) => {
        dispatch(showError(error.message || error))
      })
  }
}