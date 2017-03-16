// @flow

import type State from './RenameModel'

export const getAll = (rootState: any): State => rootState.designer.dialogs.rename

export const getShowModal = (state: any): State => getAll(state).showModal

export const getNewName = (state: any): State => getAll(state).newName

export const getPath = (state: any): State => getAll(state).path
