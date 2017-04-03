// @flow

import type {State} from './RenameModel'
import Path from '../../../repository/Path'

export const getAll = (rootState: any): State => rootState.designer.dialogs.rename

export const getShowModal = (state: any): boolean => getAll(state).showModal

export const getNewName = (state: any): ?string => getAll(state).newName

export const getPath = (state: any): Path => getAll(state).path
