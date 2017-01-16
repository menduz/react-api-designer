// import WebWorker from '../web-worker'
import ramlParser from "raml-1-parser";

export const PARSING_REQUEST = 'PARSING_REQUEST'
export const PARSING_RESULT = 'PARSING_RESULT'
export const START_PARSING = 'START_PARSING'


export const parsingRequest = text => ({
  type: PARSING_REQUEST,
  text
})

export const startParsing = () => ({
  type: START_PARSING
})

export const parseResult = (parsedText, errors) => ({
  type: PARSING_RESULT,
  errors: errors,
  parsedText: parsedText,
  receivedAt: Date.now()
})

const parse = text => (dispatch, getState) => {
  dispatch(startParsing())
  const options=  {
    serializeMetadata: false,
    dumpSchemaContents: true,
    rootNodeDetails: true
  };

  console.log("OK " + text)

  return ramlParser.parseRAML(text, options).then(api => {
    console.log("OK ")
    api = api.expand ? api.expand(true) : api;
    const result = api.toJSON(options)
    console.log(result)
    dispatch(parseResult(JSON.stringify(result), ["OK!"]))
  }).catch(err => {
    console.error(err.message)
    dispatch(parseResult(text, [err.message]))
  })


  // const worker = new WebWorker({
  //   getFile: (path) => {
  //     return text
  //   }
  // });
  //
  // const promise = worker.ramlParse('');
  // if (promise) {
  //   promise.then(result => {
  //     dispatch(parseResult(result.specification, result.errors))
  //     if (getState.isPending) {
  //       parse(getState().text)
  //     }
  //   }).catch(error => {
  //     if (error === 'aborted') console.log('aborting old parse request for', text)
  //     else
  //       dispatch(parseResult('', [error]))
  //   })
  // }
}


export const parseText = text =>  (dispatch, getState) => {
  const isParsing = getState().isParsing
  dispatch(parsingRequest(text))
  if (!isParsing) {
    dispatch(parse(text))
  }
}