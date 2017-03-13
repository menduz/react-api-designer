// @flow

import type {State} from './ImportModel'

export const getAll = (state: any): State => state.dialogs.import

export const getSelectValue = (state: any): State => getAll(state).selectValue

export const getShowModal = (state: any): State => getAll(state).showModal

export const getFileToImport = (state: any): State => getAll(state).fileToImport

export const getUrl = (state: any): State => getAll(state).url

export const isImporting = (state: any): State => getAll(state).isImporting

export const getShowConflictModal = (state: any): State => getAll(state).showConflictModal

export const getFileNameToImport = (state: any): State => getAll(state).fileNameToImport

export const getFileType = (state: any): State => getAll(state).fileType

export const getShowZipConflictModal = (state: any): State => getAll(state).showZipConflictModal

export const getAllFilesAction = (state: any): State => getAll(state).allFilesAction

export const getZipFiles = (state: any): State => getAll(state).zipFiles

export const getZipFileAction = (state: any): State => getAll(state).zipFileAction

export const getError = (state: any): State => getAll(state).error
