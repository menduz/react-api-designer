// @flow

import {NAME} from './index';
import type {State} from './model';
import Path from "../../repository/Path";
import {Set} from 'immutable'


export const getAll = (state: any): State => state.designer[NAME]

export const getExpandedFolders = (state: any): Set<Path> => getAll(state).expandedFolders

export const getCurrentPath = (state: any): ?Path => getAll(state).currentPath

export const isUpdating = (state: any): boolean => getAll(state).updating

