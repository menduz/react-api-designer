import converter from './converter'
import jsonParse from './json'
import RamlSuggest from './raml/suggest'
import RamlParser from './raml/parser'

const requestFileCallbacks = new Map();

const post = (type, payload) => {
  try {
    self.postMessage({type, payload})
  } catch (e) {
    console.error('Error when trying to post back from worker', e)
    self.postMessage({type}) // send just the type, so the flow can continue
  }
}

const listen = (type, fn) => {
  self.addEventListener('message', e => {
    if (e.data.type === type) fn(e.data.payload);
  }, false)
}

const listenThenPost = (type, fn) => {
  listen(type, data => {
    console.time(type)
    fn(data)
      .then(result => {
        console.timeEnd(type)
        return post(type + '-resolve', result)
      })
      .catch(error => {
        console.timeEnd(type)
        // js exceptions cant be serialized as normal strings, so just post the error message in that case
        const serializableError = error.stack ? {message: error.message} : error
        return post(type + '-reject', serializableError)
      })
  })
}

const requestFile = (path, callback) => {
  const callbackList = requestFileCallbacks.get(path) || [];
  callbackList.push(callback)
  requestFileCallbacks.set(path, callbackList)
  post('requestFile', {path})
}

const responseFile = (path, error, content) => {
  const callbacks = requestFileCallbacks.get(path);
  if (callbacks) {
    callbacks.forEach(callback => callback(error, content))
    requestFileCallbacks.delete(path)
  }
}

const requestFilePromise = path => {
  return new Promise((resolve, reject) => {
    requestFile(path, (err, content) => {
      if (err) reject(err)
      else resolve(content)
    })
  })
}

const ramlParser = new RamlParser(requestFilePromise);
const ramlSuggest = new RamlSuggest(requestFilePromise);

listenThenPost('ramlParse', data => ramlParser.parse(data.path))

listenThenPost('ramlSuggest', data => ramlSuggest.suggestions(data.content, data.cursorPosition))

listenThenPost('specConvert', data => converter(data.path, data.from, data.to, {format: data.format}))

listen('requestFile', data => responseFile(data.path, data.error, data.content))

listenThenPost('jsonParse', data => jsonParse(data.text))

listenThenPost('oasParse', data => {
  return new Promise((resolve, reject) => {
    converter(data.text, "SWAGGER", "RAML10", {validateImport: true}).then(raml => {
      ramlParser.parseData(raml).then(resolve).catch(reject)
    }).catch(reject)
  })
})
