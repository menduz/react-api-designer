// @flow

import {NAME} from "./DependencyCons"
import type {Dependency, GAV} from "./DependencyModel"
import type {Fragment} from "../consume-api/Fragment"

export const getAll = (rootState: any): Dependency => rootState.designer[NAME]

export const getError = (rootState: any): string => getAll(rootState).error

export const isOpen = (rootState: any): boolean => getAll(rootState).isOpen

export const isSearching = (rootState: any): boolean => getAll(rootState).isSearching

export const canUpdate = (rootState: any): boolean => getAll(rootState).canUpdate

export const getFragment = (rootState: any): $Shape<Fragment> => getAll(rootState).fragment

export const getCurrentGAV = (rootState: any): GAV => getAll(rootState).currentGAV
