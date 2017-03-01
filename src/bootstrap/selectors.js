// @flow

import {NAME} from './index'
import type {State} from './model'
import type RemoteApiDataProvider from '../remote-api/model'

export const getAll = (rootState: any): State => rootState[NAME]

export const getRemoteApiDataProvider = (rootState: any): ?RemoteApiDataProvider => getAll(rootState).remoteApiDataProvider

export const isInitializing = (rootState: any): boolean => getAll(rootState).initializing
