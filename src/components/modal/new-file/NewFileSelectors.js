// @flow

import type {FileType, State} from './NewFileModel'
import Path from '../../../repository/Path'

export const getAll = (rootState: any): State => rootState.designer.dialogs.newFile

export const getFileName = (state: any): string => getAll(state).fileName

export const getFileTypeOptions = (state: any): FileType[] => getAll(state).fileTypeOptions

export const getFileType = (state: any): ?FileType => getAll(state).fileType

export const getFragmentType = (state: any): ?FileType => getAll(state).fragmentType

export const getShowModal = (state: any): boolean => getAll(state).showModal

export const getPath = (state: any): ?Path => getAll(state).path
