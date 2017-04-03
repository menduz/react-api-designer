// @flow

import type {State} from './UnsavedModel'

export const getAll = (rootState: any): State => rootState.designer.dialogs.unsaved

export const isShowModal = (state: any): boolean => getAll(state).showModal

export const isSaving = (state: any): boolean => getAll(state).saving

export const getFinishAction = (state: any): string => getAll(state).finishAction

