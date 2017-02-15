// @flow

import NewFolderReducer from './NewFolderReducer'
import NewFolderModal from './NewFolderModal'
import NewFolderModalContainer from './NewFolderModalContainer'

import * as NewFolderActions from './NewFolderActions'
import * as NewFolderSelectors from './NewFolderSelectors'

export default {
  actions: NewFolderActions,
  reducer: NewFolderReducer,
  selectors: NewFolderSelectors,
  NewFolderModalContainer,
  NewFolderModal
}
