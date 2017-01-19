export const PARSING_REQUEST = 'PARSING_REQUEST'
export const PARSING_RESULT = 'PARSING_RESULT'

export const SUGGESTION = 'SUGGESTION'
export const SUGGESTION_RESULT = 'SUGGESTION_RESULT'

const suggestion = ({
    type: SUGGESTION
})

const suggestionResult = suggestions => ({
    type: SUGGESTION_RESULT,
    suggestions
})


export const suggest = (text, offset) => (dispatch, getState, { worker }) => {
  dispatch(suggestion)
  worker.ramlSuggest(text, offset).then(result => {
    dispatch(suggestionResult(result))
  }).catch(e => {
    dispatch(suggestionResult([]))
  })
}


export const parsingRequest = text => ({
    type: PARSING_REQUEST,
    text
})

export const parseResult = (parsedObject, errors) => ({
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