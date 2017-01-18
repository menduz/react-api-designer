import parse from './parse'
import {SUGGESTION, SUGGESTION_RESULT} from '../actions'
export {parse as parseReducer};

export const suggestionReducer = (state = {
  suggestions: [],
  isSearching:false,
}, action) => {
  switch (action.type) {
    case SUGGESTION:
      return {
        ...state,
        isSearching: true
      }
    case SUGGESTION_RESULT:
      return {
        ...state,
        suggestions: action.suggestions,
        isSearching: false
      }
    default:
      return state
  }
}