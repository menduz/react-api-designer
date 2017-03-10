import * as actions from './ConsumeApiActions'
import {List} from 'immutable'

const initialState = {
  fragments: List(),
  isOpen: false,
  query: '',
  isSearching: false,
  isSubmitting: false,
  error: '',
  isMock: false
}

export default (state = initialState, action: any) => {
  switch (action.type) {
    case actions.CLEAR:
      return initialState
    case actions.OPEN_MODAL:
      return {
        ...state,
        isOpen: true
      }
    case actions.FRAGMENTS_CHANGED:
      return {
        ...state,
        fragments: action.payload
      }
    case actions.UPDATE_QUERY:
      return {
        ...state,
        query: action.payload
      }
    case actions.IS_SEARCHING:
      return {
        ...state,
        isSearching: action.payload,
        error: ''
      }
    case actions.IS_SUBMITTING:
      return {
        ...state,
        isSubmitting: action.payload,
        error: ''
      }
    case actions.ERROR:
      return {
        ...state,
        error: action.payload
      }
    default:
      return state
  }
}