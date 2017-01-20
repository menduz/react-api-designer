export const PARSING_REQUEST = 'DESIGNER/EDITOR/PARSING_REQUEST'
export const PARSING_RESULT = 'DESIGNER/EDITOR/PARSING_RESULT'

export const SUGGESTION_REQUEST = 'DESIGNER/EDITOR/SUGGESTION_REQUEST'
export const SUGGESTION_RESULT = 'DESIGNER/EDITOR/SUGGESTION_RESULT'

export const SET_CURSOR = 'DESIGNER/EDITOR/SET_CURSOR'
export const SET_TEXT = 'DESIGNER/EDITOR/SET_TEXT'

export const goToLine = (line, column) => dispatch => {
  dispatch({
    type: SET_CURSOR,
    line,
    column
  })

  // just a go, free cursor state right after
  window.setTimeout(() => dispatch({
      type: SET_CURSOR
  }))
}

export const setText = (text) => dispatch => {
  dispatch({
    type: SET_TEXT,
    text
  })

  // just a go, free cursor state right after
  window.setTimeout(() => dispatch({
      type: SET_TEXT
  }))
}

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


const parsingRequest = text => ({
  type: PARSING_REQUEST,
  text
})

const parseResult = (parsedObject, errors) => ({
  type: PARSING_RESULT,
  language: "raml",
  errors: errors,
  parsedObject: parsedObject,
  receivedAt: Date.now()
})

export const parseText = (value) => (dispatch, getState, { worker }) => {
  dispatch(parsingRequest(value))

  worker.setRepositoryContent(value)
  const promise = worker.ramlParse('/api.raml');
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
}