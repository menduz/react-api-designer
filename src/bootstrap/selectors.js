// @flow

import {NAME} from './index'
import type {State} from './model'

export const getAll = (rootState: any): State => rootState[NAME]

export const getProjectId = (rootState: any): string => getAll(rootState).projectId

export const isInitializing = (rootState: any): boolean => getAll(rootState).initializing

export const hasProjectSelected = (rootState: any): string => !isInitializing(rootState) && getProjectId(rootState)
