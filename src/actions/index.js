import RamlParser from '../../src-worker/raml/parser'

export const PARSING_REQUEST = 'PARSING_REQUEST'
export const PARSING_RESULT = 'PARSING_RESULT'

export const SUGGESTION = 'SUGGESTION'
export const SUGGESTION_RESULT = 'SUGGESTION_RESULT'

export const useWorker = false

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
    mimeType: "text/raml", // todo check raml mimeType
    errors: errors,
    parsedObject: parsedObject,
    receivedAt: Date.now()
})

export const parseText = (value) => (dispatch, getState, { worker }) => {
    dispatch(parsingRequest(value))

  if (useWorker) {
    worker.setRepositoryContent(value)
    const promise = worker.ramlParse('#api.raml');
    if (promise) {
      promise.then(result => {
        console.log("result!")
        dispatch(parseResult(result.specification, result.errors))
      }).catch(error => {
        console.log("error " + error)
        if (error === 'aborted') console.log('aborting old parse request for', error)
        else dispatch(parseResult('', [error]))
      })
    }
  } else {

    const ramlParser = new RamlParser(path => {
      return Promise.resolve(value)
    });

    ramlParser.parse('path').then(result => {
      dispatch(parseResult(result.specification, result.errors))
    }).catch(err => {
      console.error(err.message)
      dispatch(parseResult({}, [err.message]))
    })
  }

}