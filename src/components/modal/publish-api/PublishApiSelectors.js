// @flow

import {NAME} from './PublishApiConstants'
import type {State} from './PublishApiModel'

export const getAll = (rootState: any): State => rootState.designer[NAME]

export const isOpen = (state: any): boolean => getAll(state).isOpen
