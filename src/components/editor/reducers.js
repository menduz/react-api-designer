import {
  SET_CURSOR,
  START_PARSING, PARSING_REQUEST, PARSING_RESULT,
  SUGGESTION_REQUEST, SUGGESTION_RESULT
} from './actions'


const initialState = {
  language: "raml",
  text: "#%RAML 1.0\n",
  cursor: null,

  isParsing: false,
  isPending: false,
  parsedObject: {},
  errors: [],

  isSearching: false,
  suggestions: []
};

export default (state = initialState, action) => {
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
        text: action.text,
        isPending: isPending
      }
    case PARSING_RESULT:
      return {
        ...state,
        isParsing: false,
        language: action.language,
        errors: action.errors,
        parsedObject: action.parsedObject,
        lastUpdated: action.receivedAt
      }

    case SET_CURSOR:
      return {
        ...state,
        cursor: !action.line ? null : {
          line: action.line,
          column: action.column
        }
      }

    case SUGGESTION_REQUEST:
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