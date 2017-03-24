// @flow

import type {State} from './NewFileModel'

export const getAll = (rootState: any): State => rootState.designer.dialogs.newFile

export const getFileName = (state: any): State => getAll(state).fileName

export const getFileTypeOptions = (state: any): State => getAll(state).fileTypeOptions

export const getFileType = (state: any): State => getAll(state).fileType

export const getFragmentType = (state: any): State => getAll(state).fragmentType

export const getShowModal = (state: any): State => getAll(state).showModal

export const getPath = (state: any): State => getAll(state).path
