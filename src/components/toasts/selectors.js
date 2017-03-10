//@flow

import {NAME} from './index'

export const getAll = (state: any) => state[NAME]

export const getToasts = (state: any) => getAll(state).toasts
