// @flow

import {NAME} from './constants'
import type {State} from './model'

export const getAll = (rootState: any): State => rootState.designer[NAME]

export const isOpen = (rootState: any): boolean => getAll(rootState).isOpen

export const getMessage = (rootState: any): string => getAll(rootState).message

export const getTitle = (rootState: any): string => getAll(rootState).title
