//@flow

import {NAME} from './ConsumeApiConstants'
import {Fragment} from "./Fragment"
import {List} from 'immutable'

export const getAll = (rootState: any): any => rootState[NAME]

export const getFragments = (rootState: any): List<Fragment> => getAll(rootState).fragments

export const getQuery = (rootState: any): string => getAll(rootState).query

export const getError = (rootState: any): string => getAll(rootState).error

export const isOpen = (rootState: any): boolean => getAll(rootState).isOpen

export const isSearching = (rootState: any): boolean => getAll(rootState).isSearching

export const isSubmitting = (rootState: any): boolean => getAll(rootState).isSubmitting
