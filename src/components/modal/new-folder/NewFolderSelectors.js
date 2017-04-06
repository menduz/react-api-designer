// @flow

import Path from '../../../repository/Path'
import type {State} from './NewFolderModel'

export const getAll = (rootState: any): State => rootState.designer.dialogs.newFolder

export const getShowModal = (state: any): boolean => getAll(state).showModal

export const getFolderName = (state: any): string => getAll(state).folderName

export const getPath = (state: any): ?Path => getAll(state).path
