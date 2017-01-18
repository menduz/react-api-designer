// import WebWorker from '../web-worker'
import ramlParser from "raml-1-parser";
import Suggest from '../../src-worker/raml/suggest'

export const PARSING_REQUEST = 'PARSING_REQUEST'
export const PARSING_RESULT = 'PARSING_RESULT'
export const START_PARSING = 'START_PARSING'

export const SUGGESTION = 'SUGGESTION'
export const SUGGESTION_RESULT = 'SUGGESTION_RESULT'

const suggestion = (suggestionText, offset) => ({
    type: SUGGESTION,
    suggestionText,
    offset
})

const suggestionResult = suggestions => ({
    type: SUGGESTION_RESULT,
    suggestions
})


export const suggest = (text, offset) => (dispatch, getState, { worker }) => {
  dispatch(suggestion (text, offset))
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

export const startParsing = () => ({
    type: START_PARSING
})

export const parseResult = (parsedObject, errors) => ({
    type: PARSING_RESULT,
    mimeType: "text/raml", // todo check raml mimeType
    errors: errors,
    parsedObject: parsedObject,
    receivedAt: Date.now()
})

const parse = text => (dispatch) => {
    dispatch(startParsing())
    const options = {
        serializeMetadata: false,
        dumpSchemaContents: true,
        rootNodeDetails: true
    };

    return ramlParser.parseRAML(text, options).then(api => {
        // console.log("OK ")
        api = api.expand ? api.expand(true) : api;
        const result = api.toJSON(options)
        console.log(result)
        dispatch(parseResult(JSON.stringify(result), ["OK!"]))
    }).catch(err => {
        console.error(err.message)
        dispatch(parseResult(text, [err.message]))
    })
}

export const parseText = (value) => (dispatch, getState, { worker }) => {
    dispatch(parsingRequest(value))
    dispatch(startParsing())
    const promise = worker.ramlParse('#api.raml');
    if (promise) {
        promise.then(result => {
            dispatch(parseResult(result.specification, result.errors))
        }).catch(error => {
            if (error === 'aborted') console.log('aborting old parse request for', error)
            else dispatch(parseResult('', [error]))
        })
    }
}