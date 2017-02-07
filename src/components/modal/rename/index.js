// @flow

import RenameReducer from './RenameReducer'
import RenameModal from './RenameModal'
import RenameModalContainer from './RenameModalContainer'

import * as RenameActions from './RenameActions'
import * as RenameSelectors from './RenameSelectors'

export default {
  actions: RenameActions,
  reducer: RenameReducer,
  selectors: RenameSelectors,
  RenameModalContainer,
  RenameModal
}
