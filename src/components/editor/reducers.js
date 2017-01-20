import {
  SET_TEXT, SET_POSITION,
  PARSING_REQUEST, PARSING_RESULT,
  SUGGESTION_REQUEST, SUGGESTION_RESULT
} from './actions'


const initialState = {
  language: "raml",
  text: "#%RAML 1.0\n",
  path: '/api.raml',
  position: null,

  isParsing: false,
  parsedObject: {},
  errors: [],

  isSearching: false,
  suggestions: []
};

export default (state = initialState, action) => {
  switch (action.type) {

    case SET_TEXT:
      return {
        ...state,
        text: action.text,
        path: action.path
      }
    case SET_POSITION:
      return {
        ...state,
        position: {
          line: action.line,
          column: action.column
        }
      }

    case PARSING_REQUEST:
      return {
        ...state,
        isParsing: true,
        text: action.text
      }
    case PARSING_RESULT:
      return {
        ...state,
        isParsing: false,
        language: action.language,
        errors: action.errors,
        parsedObject: action.parsedObject
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