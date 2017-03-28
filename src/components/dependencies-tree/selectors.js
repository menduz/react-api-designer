// @flow

import {NAME} from './index';
import type {State} from './model';

export const getAll = (state: any): State => state.designer[NAME]

export const getExpandedFolders = (state: any): State => getAll(state).expandedFolders

export const getCurrentPath = (state: any): State => getAll(state).currentPath

export const isUpdating = (state: any): boolean => getAll(state).updating

