// @flow

import type {State} from './ImportModel'

export const getAll = (rootState: any): State => rootState.designer.dialogs.import

export const getSelectValue = (state: any): string => getAll(state).selectValue

export const getShowModal = (state: any): boolean => getAll(state).showModal

export const getFileToImport = (state: any): ?any => getAll(state).fileToImport

export const getUrl = (state: any): ?string => getAll(state).url

export const isImporting = (state: any): boolean => getAll(state).isImporting

export const getShowConflictModal = (state: any): boolean => getAll(state).showConflictModal

export const getFileNameToImport = (state: any): string => getAll(state).fileNameToImport

export const getFileType = (state: any): ?string => getAll(state).fileType

export const getShowZipConflictModal = (state: any): boolean => getAll(state).showZipConflictModal

export const getAllFilesAction = (state: any): ?any => getAll(state).allFilesAction

export const getZipFiles = (state: any): any[] => getAll(state).zipFiles

export const getZipFileAction = (state: any): ?any => getAll(state).zipFileAction

export const getError = (state: any): string => getAll(state).error
