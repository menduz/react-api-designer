import RamlParser from './raml/parser'
import ramlSuggest from './raml/suggest'
import converter from './converter'

const response = (type, data) => {
  data.type = type
  self.postMessage(data)
}

const requestFileCallbacks = new Map();
const requestFile = (path, callback) => {
  const callbackList = requestFileCallbacks.get(path) || [];
  callbackList.push(callback)
  requestFileCallbacks.set(path, callbackList)
  response('request-file', {path})
}
const responseFile = (path, error, content) => {
  const callbacks = requestFileCallbacks.get(path);
  if (callbacks) {
    callbacks.forEach(callback => callback(error, content))
    requestFileCallbacks.delete(path)
  }
}

const ramlParser = new RamlParser(path => {
  return new Promise((resolve, reject) => {
    requestFile(path, (err, content) => {
      if (err) reject(err)
      else resolve(content)
    })
  })
});

self.addEventListener('message', (e) => {
  const message = e.data
  switch (message.type) {

    case 'request-file':
      return responseFile(message.path, message.error, message.content)

    case 'raml-parse':
      return ramlParser.parse(message.path).then(result => {
        requestFileCallbacks.clear()
        response('raml-parse-resolve', result)
      }).catch(error => {
        requestFileCallbacks.clear()
        response('raml-parse-reject', error)
      })

    case 'raml-suggest':
      return ramlSuggest(message.path, message.cursor).then(result => {
        response('raml-suggest-resolve', result)
      }).catch(error => {
        response('raml-suggest-reject', error)
      })

    case 'spec-convert':
      return converter(message.path, message.from, message.to, message.format).then(result => {
        response('spec-convert-resolve', result)
      }).catch(error => {
        response('spec-convert-reject', error)
      })

  }
}, false)