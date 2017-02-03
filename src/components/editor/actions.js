import {PREFIX} from './constants'
import {getCurrentFilePath, getLanguage} from './selectors'
import {Path} from '../../repository'
import {updateFileContent, saveFile} from '../../repository-redux/actions'
import {getFileTree} from '../../repository-redux/selectors'
import {RepositoryTypeFactory} from '../../repository/type'
import {language} from '../../repository/helper/extensions'

export const PARSING_REQUEST = `DESIGNER/${PREFIX}/PARSING_REQUEST`
export const PARSING_RESULT = `DESIGNER/${PREFIX}/PARSING_RESULT`

export const SUGGESTION_REQUEST = `DESIGNER/${PREFIX}/SUGGESTION_REQUEST`
export const SUGGESTION_RESULT = `DESIGNER/${PREFIX}/SUGGESTION_RESULT`

export const SET_POSITION = `DESIGNER/${PREFIX}/SET_POSITION`
export const SET_PATH = `DESIGNER/${PREFIX}/SET_TEXT`

export const setPosition = (line, column) => ({
  type: SET_POSITION,
  line,
  column
})

const suggestionResult = suggestions => ({
  type: SUGGESTION_RESULT,
  suggestions
})

export const suggest = (text, cursorPosition, path, repository) =>
  (dispatch, getState, {worker}) => {
    const fileTree = getFileTree(getState())
    if (!fileTree) return
    if (getLanguage(getState()).id !== 'raml') return

    const path = getCurrentFilePath(getState()).toString()
    const repository = RepositoryTypeFactory.fromRepositoryModel(fileTree)

    dispatch({type: SUGGESTION_REQUEST})

    worker.ramlSuggest(text, cursorPosition, path, repository)
      .then(result => {
        dispatch(suggestionResult(result))
      })
      .catch(e => { dispatch(suggestionResult([])) })
  }

const setPath = (path, language) => ({
  type: SET_PATH,
  path, language
})

const parsingRequest = () => ({
  type: PARSING_REQUEST
})

const parseResult = (parsedObject, errors) => ({
  type: PARSING_RESULT,
  errors: errors,
  parsedObject: parsedObject
})

const mapUnexpectedError = (error) =>{
  return { message: error.message, startLineNumber: 1, endLineNumber: 1, startColumn: 0}
}

const parserError = (error, dispatch) =>{
  if (error === 'aborted') console.log('Aborting old parse request')
  else dispatch(parseResult(null, [error]))
};

const parseJson = function (text, path, dispatch, worker) {
  dispatch(parsingRequest())

  const promise = worker.jsonParse({text})
  if (promise) {
    promise.then(result => {
      dispatch(parseResult(result, []))
    }).catch(error => parserError(error, dispatch))
  }
}

const parseRaml = function (text, path, dispatch, worker) {
  dispatch(parsingRequest())
  const promise = worker.ramlParse({path})
  if (promise) {
    promise.then(result => dispatch(parseResult(result.specification, result.errors))).
    catch(error => parserError(mapUnexpectedError(error), dispatch))
  }
}

const parseOas = function (text, path, dispatch, worker) {
  dispatch(parsingRequest())
  const promise = worker.oasParse({text})
  if (promise) {
    promise.then(result => dispatch(parseResult(result.specification, result.errors))).
    catch(error => parserError(mapUnexpectedError(error), dispatch))
  }
}

export const updateCurrentFile = (text, delay = 0) =>
  (dispatch, getState) => {
    dispatch(updateFile(text, getCurrentFilePath(getState()), delay))
  }

let parseTimer = null
export const updateFile = (text, path: Path, delay = 0) =>
  (dispatch, getState, {worker}) => {
    dispatch(updateFileContent(path, text))
    dispatch(setPath(path, language(path.toString(), text)))

    if (parseTimer) clearTimeout(parseTimer)

    parseTimer = setTimeout(() => {
      const pathString = path.toString()
      switch (getLanguage(getState()).id) {
        case 'raml':
          return parseRaml(text, pathString, dispatch, worker)
        case 'oas':
          return parseOas(text, pathString, dispatch, worker)
        case 'json':
          return parseJson(text, pathString, dispatch, worker)
        default:
          dispatch(parseResult({}, []))
      }
    }, delay)
  }

export const saveCurrentFile = () => (dispatch, getState) => {
  dispatch(saveFile(getCurrentFilePath(getState())))
}
