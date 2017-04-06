// @flow

import type {State} from './ExportModel'

export const getAll = (rootState: any): State => rootState.designer.dialogs.export

export const getExportName = (state: any): string => getAll(state).exportName

export const getType = (state: any): string => getAll(state).type

export const getShowModal = (state: any): boolean => getAll(state).showModal

export const getShowError = (state: any): boolean => getAll(state).showError

export const isExporting = (state: any): boolean => getAll(state).isExporting
