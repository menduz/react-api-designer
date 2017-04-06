import {
  SET_PATH, SET_POSITION,
  PARSING_REQUEST, PARSING_RESULT,
  SUGGESTION_REQUEST, SUGGESTION_RESULT, CLEAN_EDITOR
} from './actions'

import {actions as repositoryActions} from '../../repository-redux'
import Path from '../../repository/Path'

const elementLocationChangedReducer = (state, oldPath: Path, newPath: Path) => {
  const path: ?Path = state.path

  if(path && path.equalsTo(oldPath)) {
    return { ...state, path: newPath}
  }

  if (path && path.isDescendantOf(oldPath)) {
    const relativePath = oldPath.relativePathTo(path)
    const resultPath = Path.mergePath(newPath, relativePath)
    return { ...state, path: resultPath}
  }

  return state
}

const initialState = {
  path: null,
  language: {id: ''},
  position: null,

  isParsing: false,
  parsedObject: null,
  errors: [],

  isSearching: false,
  suggestions: []
}

export default (state = initialState, action) => {
  switch (action.type) {

    case SET_PATH:
      return {
        ...state,
        path: action.path,
        language: action.language,
        parsedObject: action.clearParseResult ? null : state.parsedObject,
        errors: action.clearParseResult ? [] : state.errors
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
    case CLEAN_EDITOR:
      return initialState
    case repositoryActions.ELEMENT_RENAMED:
      return elementLocationChangedReducer(state, action.payload.oldPath, action.payload.element.path)
    case repositoryActions.ELEMENT_MOVED:
      return elementLocationChangedReducer(state, action.payload.source, action.payload.destination)
    default:
      return state
  }
}