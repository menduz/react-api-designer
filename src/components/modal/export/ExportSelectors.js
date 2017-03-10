// @flow

import type {State} from './ExportModel'

export const getAll = (state: any): State => state.dialogs.export

export const getExportName = (state: any): State => getAll(state).exportName

export const getType = (state: any): State => getAll(state).type

export const getShowModal = (state: any): State => getAll(state).showModal

export const getShowError = (state: any): State => getAll(state).showError

export const isExporting = (state: any): State => getAll(state).isExporting
