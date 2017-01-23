import {
  SET_TEXT, SET_POSITION,
  PARSING_REQUEST, PARSING_RESULT,
  SUGGESTION_REQUEST, SUGGESTION_RESULT
} from './actions'


const initialState = {
  text: '',
  path: null,
  language: {id: ''},
  position: null,

  isParsing: false,
  parsedObject: null,
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
        path: action.path,
        language: action.language
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
        isParsing: true
      }
    case PARSING_RESULT:
      return {
        ...state,
        isParsing: false,
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