//@flow

import {NAME} from './index'

export const getAll = (rootState: any) => rootState.designer[NAME]

export const getToasts = (state: any) => getAll(state).toasts
