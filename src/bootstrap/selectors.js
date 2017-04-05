// @flow

import {NAME} from './index'
import type {State, ProjectType} from './model'
import {toName} from './model'

export const getAll = (rootState: any): State => rootState.designer[NAME]

export const getProjectId = (rootState: any): string => getAll(rootState).projectId

export const getProjectType = (rootState: any): ProjectType => getAll(rootState).projectType

export const getProjectTypeLabel = (rootState: any): string => toName(getProjectType(rootState))

export const isInitializing = (rootState: any): boolean => getAll(rootState).initializing

export const hasProjectSelected = (rootState: any): boolean => !isInitializing(rootState) && !!getProjectId(rootState)
