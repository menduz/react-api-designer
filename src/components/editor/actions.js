import {PREFIX} from './index'
import {getCurrentFilePath, getLanguage} from './selectors'

export const PARSING_REQUEST = `DESIGNER/${PREFIX}/PARSING_REQUEST`
export const PARSING_RESULT = `DESIGNER/${PREFIX}/PARSING_RESULT`

export const SUGGESTION_REQUEST = `DESIGNER/${PREFIX}/SUGGESTION_REQUEST`
export const SUGGESTION_RESULT = `DESIGNER/${PREFIX}/SUGGESTION_RESULT`

export const SET_POSITION = `DESIGNER/${PREFIX}/SET_POSITION`
export const SET_TEXT = `DESIGNER/${PREFIX}/SET_TEXT`

export const setPosition = (line, column) => ({
  type: SET_POSITION,
  line,
  column
})

const suggestionResult = suggestions => ({
  type: SUGGESTION_RESULT,
  suggestions
})

export const suggest = (text, offset) => (dispatch, getState, {worker}) => {
  if (getLanguage(getState()) !== 'raml') return

  dispatch({
    type: SUGGESTION_REQUEST
  })

  worker.ramlSuggest(text, offset).then(result => {
    dispatch(suggestionResult(result))
  }).catch(e => {
    dispatch(suggestionResult([]))
  })
}

const calculateLanguage = (text, path) => {
    const lastDot = path.lastIndexOf('.');
    const extension = lastDot > -1 ? path.substring(lastDot + 1) : 'txt';
    switch (extension) {
        case 'json':
            // detect swagger based on text content
            return text.indexOf('swagger') > -1 ? 'swagger' : extension
        case 'yml':
            return 'yaml'
        default:
            return extension
    }
}

const setText = (text, path) => ({
  type: SET_TEXT,
  text,
  path,
  language: calculateLanguage(text, path)
})

const parsingRequest = () => ({
  type: PARSING_REQUEST
})

const parseResult = (parsedObject, errors) => ({
  type: PARSING_RESULT,
  errors: errors,
  parsedObject: parsedObject
})

export const updateCurrentFile = (text, delay = 0) =>
    (dispatch, getState) => {
        dispatch(updateFile(text, getCurrentFilePath(getState()), delay))
    }

let parseTimer = null
export const updateFile = (text, path, delay = 0) =>
    (dispatch, getState, { worker, repositoryContainer }) => {
  dispatch(setText(text, path))

  if (repositoryContainer.isLoaded && path && text)
      repositoryContainer.repository.setContent(path, text)

  if (parseTimer) clearTimeout(parseTimer)

  switch(getLanguage(getState())) {
      case 'raml':
          parseTimer = setTimeout(() => {
              dispatch(parsingRequest())

              worker.setRepositoryContent(text)
              const promise = worker.ramlParse(path);
              if (promise) {
                  promise.then(result => {
                      dispatch(parseResult(result.specification, result.errors))
                  }).catch(error => {
                      if (error === 'aborted') console.log('Aborting old parse request')
                      else {
                          // report unexpected errors in the first line
                          dispatch(parseResult(null, [{
                              message: error.message,
                              startLineNumber: 1,
                              endLineNumber: 1,
                              startColumn: 0,
                              severity: "error"
                          }]))
                      }
                  })
              }
          }, delay)
          break
      case 'json':
          try {
            dispatch(parseResult(JSON.parse(text), []))
          } catch (e) {
              dispatch(parseResult({}, [{
                  message: e.message,
                  startLineNumber: 1,
                  endLineNumber: 1,
                  startColumn: 0,
                  severity: "error"
              }]))
          }
          break
      default:
          dispatch(parseResult({}, []))
  }
}