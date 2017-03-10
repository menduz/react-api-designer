// @flow

import type {State} from './NewFolderModel'

export const getAll = (state: any): State => state.dialogs.newFolder

export const getShowModal = (state: any): State => getAll(state).showModal

export const getFolderName = (state: any): State => getAll(state).folderName

export const getPath = (state: any): State => getAll(state).path
