export const getAll = (rootState) => rootState.designer['configuration']

export const getTheme = (rootState) => getAll(rootState).theme

export const getPublishToExchange = (rootState) => getAll(rootState).publishToExchange

export const isExchangeMode = (rootState) => getAll(rootState).isExchangeMode

export const isConsumeMode = (rootState) => getAll(rootState).isConsumeMode
