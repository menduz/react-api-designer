import {
  START_PARSING, PARSING_REQUEST, PARSING_RESULT
} from '../actions'


let initialState = {
  isParsing: false,
  isPending: false,
  language: "",
  errors: [],
  text: "",
  parsedObject: {}
};

const parse = (state = initialState, action) => {
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
        language: action.language,
        errors: action.errors,
        parsedObject: action.parsedObject,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}

export default parse