// @flow

import {NAME} from './ConsumeApiConstants'
import {Fragment} from "./Fragment"
import {List} from 'immutable'
import type {ConsumeState} from "./ConsumeModel";

export const getAll = (rootState: any): ConsumeState => rootState.designer[NAME]

export const getFragments = (rootState: any): List<Fragment> => getAll(rootState).fragments

export const getQuery = (rootState: any): string => getAll(rootState).query

export const getError = (rootState: any): string => getAll(rootState).error

export const isOpen = (rootState: any): boolean => getAll(rootState).isOpen

export const isSearching = (rootState: any): boolean => getAll(rootState).isSearching

export const isSubmitting = (rootState: any): boolean => getAll(rootState).isSubmitting

export const isAddingMore = (rootState: any): boolean => getAll(rootState).isAddingMore

export const isNoMoreFragments = (rootState: any): boolean => getAll(rootState).noMoreFragments
