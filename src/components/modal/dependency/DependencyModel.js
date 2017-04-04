// @flow

import type {Fragment} from '../consume-api/Fragment'

export type Dependency = {
  isOpen: boolean,
  isSearching: boolean,
  error: string,
  canUpdate: boolean,
  currentGAV: GAV,
  fragment: $Shape<Fragment>
}

export type GAV = {
  groupId: string,
  assetId: string,
  version: string
}