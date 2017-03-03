import {PREFIX} from './constants'
import {getCurrentFilePath, getLanguage} from './selectors'
import {Path} from '../../repository'
import {updateFileContent, saveFile, remove, saveAll} from '../../repository-redux/actions'
import {getFileTree} from '../../repository-redux/selectors'
import {RepositoryTypeFactory} from '../../repository/type'
import {language} from '../../repository/helper/extensions'

export const PARSING_REQUEST = `DESIGNER/${PREFIX}/PARSING_REQUEST`
export const PARSING_RESULT = `DESIGNER/${PREFIX}/PARSING_RESULT`

export const SUGGESTION_REQUEST = `DESIGNER/${PREFIX}/SUGGESTION_REQUEST`
export const SUGGESTION_RESULT = `DESIGNER/${PREFIX}/SUGGESTION_RESULT`

export const SET_POSITION = `DESIGNER/${PREFIX}/SET_POSITION`
export const SET_PATH = `DESIGNER/${PREFIX}/SET_TEXT`

export const CLEAN_EDITOR = `DESIGNER/${PREFIX}/CLEAN_EDITOR`

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
  (dispatch, getState, {designerWorker}) => {
    const fileTree = getFileTree(getState())
    if (!fileTree) return
    if (getLanguage(getState()).id !== 'raml') return

    const path = getCurrentFilePath(getState()).toString()
    const repository = RepositoryTypeFactory.fromRepositoryModel(fileTree)

    dispatch({type: SUGGESTION_REQUEST})

    designerWorker.ramlSuggest(text, cursorPosition, path, repository)
      .then(result => {
        dispatch(suggestionResult(result))
      })
      .catch(e => {
        dispatch(suggestionResult([]))
      })
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

const mapUnexpectedError = (error) => {
  return {message: error.message, startLineNumber: 1, endLineNumber: 1, startColumn: 0}
}

const parserError = (error, dispatch) => {
  if (error === 'aborted') console.log('Aborting old parse request')
  else dispatch(parseResult(null, [error]))
}

const parseJson = (text, path, dispatch, designerWorker) => {
  dispatch(parsingRequest())

  const promise = designerWorker.jsonParse({text})
  if (promise) {
    promise.then(result => {
      dispatch(parseResult(result, []))
    }).catch(error => parserError(error, dispatch))
  }
}

const parseRaml = (text, path, dispatch, designerWorker) => {
  dispatch(parsingRequest())
  const promise = designerWorker.ramlParse({path})
  if (promise) {
    promise.then(result => dispatch(parseResult(result.specification, result.errors)))
      .catch(error => parserError(mapUnexpectedError(error), dispatch))
  }
}

const parseOas = (text, path, dispatch, designerWorker) => {
  dispatch(parsingRequest())
  const promise = designerWorker.oasParse({text})
  if (promise) {
    promise.then(result => dispatch(parseResult(result.specification, result.errors)))
      .catch(error => parserError(mapUnexpectedError(error), dispatch))
  }
}

let parseTimer = null
export const updateFile = (text, path: Path, delay = 0) =>
  (dispatch, getState, {designerWorker}) => {
    dispatch(updateFileContent(path, text))

    const pathString = path.toString()
    const lang = language(pathString, text)
    dispatch(setPath(path, lang))

    if (parseTimer) clearTimeout(parseTimer)

    parseTimer = setTimeout(() => {
      switch (lang.id) {
        case 'raml':
          return parseRaml(text, pathString, dispatch, designerWorker)
        case 'oas':
          return parseOas(text, pathString, dispatch, designerWorker)
        case 'json':
          return parseJson(text, pathString, dispatch, designerWorker)
        default:
          dispatch(parseResult({}, []))
      }
    }, delay)
  }

export const updateCurrentFile = (text, delay = 0) =>
  (dispatch, getState) => {
    dispatch(updateFile(text, getCurrentFilePath(getState()), delay))
  }

export const saveCurrentFile = () => (dispatch, getState) => {
  dispatch(saveFile(getCurrentFilePath(getState())))
}

export const saveFileWithPath = (path: Path) =>
  (dispatch) => {
    dispatch(saveFile(path))
  }

export const save = () =>
  (dispatch) => {
    dispatch(saveAll())
  }

export const removeFileWithPath = (path: Path) =>
  (dispatch) => {
    dispatch(remove(path))
  }

export const clean = () => ({
  type: CLEAN_EDITOR
})
