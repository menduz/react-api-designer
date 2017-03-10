// @flow

import {NAME} from './PublishApiConstants'
import type {State} from './PublishApiModel'

export const getAll = (state: any): State => state[NAME]

export const isOpen = (state: any): State => getAll(state).isOpen
