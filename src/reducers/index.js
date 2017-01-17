import { combineReducers } from 'redux'
import {
  START_PARSING, PARSING_REQUEST, PARSING_RESULT
} from '../actions'


const parse = (state = {
  isParsing: false,
  isPending: false,
  mimeType: "",
  errors: [],
  text: "",
  parsedObject: {}
}, action) => {
  switch (action.type) {
    case START_PARSING:
      return {
        ...state,
        isPending: false
      }

    case PARSING_REQUEST:
      const isPending = state.isParsing
      return {
        ...state,
        isParsing: true,
        text:action.text,
        isPending: isPending
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


const rootReducer = combineReducers({
  parse
})

export default rootReducer