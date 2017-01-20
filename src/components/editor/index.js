export const NAME = 'editor'
export const PREFIX = 'EDITOR'

export {default as reducer} from './reducers'
export {default as Editor} from './Editor'

import * as selectors from './selectors'
export {selectors}

import * as actions from './actions'
export {actions}
