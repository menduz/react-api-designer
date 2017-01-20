import {NAME} from "./index";

export const getAll = (rootState) => rootState[NAME]

export const getCurrentFilePath = (rootState) => getAll(rootState).path

export const getLanguage = (rootState) => getAll(rootState).language