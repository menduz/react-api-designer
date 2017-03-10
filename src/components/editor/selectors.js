import {NAME} from "./constants"
import {Path} from '../../repository'

export const getAll = (rootState) => rootState[NAME]

export const getCurrentFilePath = (rootState): Path => getAll(rootState).path

export const getLanguage = (rootState) => getAll(rootState).language

export const getParsedObject = (rootState) => getAll(rootState).parsedObject

export const getErrors = (rootState) => getAll(rootState).errors

export const getSuggestions = (rootState) => getAll(rootState).suggestions

export const getPosition = (rootState) => getAll(rootState).position

export const isParsing = (rootState) => getAll(rootState).isParsing