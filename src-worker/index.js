import RamlParser from './raml/parser'
import ramlSuggest from './raml/suggest'
import converter from './converter'

const requestFileCallbacks = new Map();

const post = (type, data) => {
  data.type = type
  self.postMessage(data)
}

const listen = (type, fn) => {
  self.addEventListener('message', e => {
    if (e.data.type === type) fn(e.data);
  }, false)
}

const listenThenPost = (type, fn, finallyFn) => {
  listen(type, data => {
    fn(data)
      .then(result => {
        if (finallyFn) finallyFn(result)
        return post(type + '-resolve', result)
      })
      .catch(error => {
        if (finallyFn) finallyFn(error)
        return post(type + '-reject', error)
      })
  })
}

const requestFile = (path, callback) => {
  const callbackList = requestFileCallbacks.get(path) || [];
  callbackList.push(callback)
  requestFileCallbacks.set(path, callbackList)
  post('request-file', {path})
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

listenThenPost('raml-parse', data => ramlParser.parse(data.path), () => requestFileCallbacks.clear())

listenThenPost('raml-suggest', data => ramlSuggest(data.path, data.cursor))

listenThenPost('spec-convert', data => converter(data.path, data.from, data.to, data.format))

listen('request-file', data => responseFile(data.path, data.error, data.content))