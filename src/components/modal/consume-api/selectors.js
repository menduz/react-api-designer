//@flow

import {NAME} from './ConsumeApiConstants'

export const getAll = (rootState) => rootState[NAME]

export const getFragments = (rootState) => getAll(rootState).fragments

export const getQuery = (rootState) => getAll(rootState).query

export const getError = (rootState) => getAll(rootState).error

export const isOpen = (rootState) => getAll(rootState).isOpen

export const isSearching = (rootState) => getAll(rootState).isSearching

export const isSubmitting = (rootState) => getAll(rootState).isSubmitting

export const isMock = (rootState) => getAll(rootState).isMock
