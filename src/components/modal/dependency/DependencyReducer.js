// @flow

import type {Dependency} from './DependencyModel'
import * as actions from './DependencyActions'

const initialState: Dependency = {
  isOpen: false,
  isSearching: true,
  error: '',
  canUpdate: false,
  currentGAV: {
    groupId: '',
    assetId: '',
    version: ''
  },
  fragment: undefined
}

export default (state: Dependency = initialState, action: any): Dependency => {
  switch (action.type) {
    case actions.OPEN_MODAL:
      return {
        ...state,
        isOpen: true,
        currentGAV: action.payload
      }
    case actions.ERROR:
      return {
        ...state,
        error: action.payload,
        isSearching: false
      }
    case actions.ADD_FRAGMENT:
      return {
        ...state,
        isSearching: false,
        fragment: action.payload.fragment,
        canUpdate: action.payload.canUpdate
      }
    case actions.IS_SEARCHING:
      return {
        ...state,
        isSearching: action.payload
      }
    case actions.CLEAR:
      return initialState
    default:
      return state
  }
}