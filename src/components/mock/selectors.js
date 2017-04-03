export const getAll = (rootState: any) => rootState.designer.mock

export const findFile = (rootState: any, file) => getAll(rootState).find(c => c.file === file)
