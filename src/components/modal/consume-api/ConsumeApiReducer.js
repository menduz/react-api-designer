// @flow

import * as actions from './ConsumeApiActions'
import {List} from 'immutable'
import {ConsumeState} from "./ConsumeModel";

const initialState: ConsumeState = {
  fragments: List(),
  isOpen: false,
  query: '',
  isSearching: false,
  isSubmitting: false,
  isAddingMore: false,
  noMoreFragments: false,
  error: ''
}

export default (state: ConsumeState = initialState, action: any) => {
  switch (action.type) {
    case actions.CLEAR:
      return initialState
    case actions.OPEN_MODAL:
      return {
        ...state,
        isOpen: true
      }
    case actions.ADD_FRAGMENTS:
      return {
        ...state,
        fragments: state.fragments.concat(action.payload),
        isSearching: false,
        isAddingMore: false
      }
    case actions.NO_MORE_FRAGMENTS:
      return {
        ...state,
        noMoreFragments: true,
        isAddingMore: false
      }
    case actions.FRAGMENTS_CHANGED:
      return {
        ...state,
        fragments: action.payload,
        isSearching: false
      }
    case actions.UPDATE_QUERY:
      return {
        ...state,
        query: action.payload
      }
    case actions.IS_ADDING_MORE:
      return {
        ...state,
        isAddingMore: true
      }
    case actions.IS_SEARCHING:
      return {
        ...state,
        isSearching: true,
        error: '',
        noMoreFragments: false
      }
    case actions.IS_SUBMITTING:
      return {
        ...state,
        isSubmitting: true,
        error: ''
      }
    case actions.ERROR:
      return {
        ...state,
        error: action.payload,
        isSearching: false,
        isSubmitting: false,
        isAddingMore: false
      }
    default:
      return state
  }
}