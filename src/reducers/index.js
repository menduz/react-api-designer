import { combineReducers } from 'redux'
import {
  PARSING_REQUEST, PARSING_RESULT,
  SUGGESTION, SUGGESTION_RESULT
} from '../actions'


const parse = (state = {
  isParsing: false,
  mimeType: "",
  errors: [],
  text: "",
  parsedObject: {}
}, action) => {
  switch (action.type) {

    case PARSING_REQUEST:
      return {
        ...state,
        isParsing: true,
        text:action.text,
      }
    case PARSING_RESULT:
      return {
        ...state,
        isParsing: false,
        mimeType: action.mimeType,
        errors: action.errors,
        parsedObject: action.parsedObject,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}


const suggestion = (state = {
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

const rootReducer = combineReducers({
  parse,
  suggestion
})

export default rootReducer