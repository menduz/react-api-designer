// @flow

import NewFileReducer from './NewFileReducer'
import NewFileModal from './NewFileModal'
import NewFileModalContainer from './NewFileModalContainer'

import * as NewFileActions from './NewFileActions'
import * as NewFileSelectors from './NewFileSelectors'

export default {
  actions: NewFileActions,
  reducer: NewFileReducer,
  selectors: NewFileSelectors,
  NewFileModalContainer,
  NewFileModal
}
