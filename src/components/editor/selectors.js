// @flow

import {NAME} from './constants'
import {Path} from '../../repository'
import type {Issue} from '../errors'

export const getAll = (rootState: any) => rootState.designer[NAME]

export const getCurrentFilePath = (rootState: any): Path => getAll(rootState).path

export const getLanguage = (rootState: any) => getAll(rootState).language

export const getParsedObject = (rootState: any) => getAll(rootState).parsedObject

export const getErrors = (rootState: any): Issue[] => getAll(rootState).errors

export const getSuggestions = (rootState: any) => getAll(rootState).suggestions

export const getPosition = (rootState: any) => getAll(rootState).position

export const isParsing = (rootState: any) => getAll(rootState).isParsing

export const isReadOnly = (rootState): Path => {
  const path = getCurrentFilePath(rootState)
  return path && path.elements().first() === 'exchange_modules'
}