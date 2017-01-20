export const PARSING_REQUEST = 'DESIGNER/EDITOR/PARSING_REQUEST'
export const PARSING_RESULT = 'DESIGNER/EDITOR/PARSING_RESULT'

export const SUGGESTION_REQUEST = 'DESIGNER/EDITOR/SUGGESTION_REQUEST'
export const SUGGESTION_RESULT = 'DESIGNER/EDITOR/SUGGESTION_RESULT'

export const SET_POSITION = 'DESIGNER/EDITOR/SET_POSITION'
export const SET_TEXT = 'DESIGNER/EDITOR/SET_TEXT'

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
  dispatch({
    type: SUGGESTION_REQUEST
  })

  worker.ramlSuggest(text, offset).then(result => {
    dispatch(suggestionResult(result))
  }).catch(e => {
    dispatch(suggestionResult([]))
  })
}

const setText = (text, path) => ({
  type: SET_TEXT,
  text,
  path
})

const parsingRequest = text => ({
  type: PARSING_REQUEST,
  text
})

const parseResult = (parsedObject, errors) => ({
  type: PARSING_RESULT,
  language: "raml",
  errors: errors,
  parsedObject: parsedObject
})

let parseTimer = null
export const updateFile = (text, path, delay = 0) => (dispatch, getState, { worker }) => {
  dispatch(setText(text, path))

  if (parseTimer) clearTimeout(parseTimer)
  parseTimer = setTimeout(() => {
    dispatch(parsingRequest(text))

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
}