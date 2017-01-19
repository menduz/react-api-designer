import converter from './converter'
// import ramlSuggest from './raml/suggest'
import RamlParser from './raml/parser'

const requestFileCallbacks = new Map();

const post = (type, data, retry) => {
  data.type = type
  try {
    self.postMessage(data)
  } catch (e) {
    console.log('Error when trying to post back from worker', e)
    if (retry) {
      // send just the type, so the flow can continue
      self.postMessage({type})
    }
  }
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
        return post(type + '-resolve', result, true)
      })
      .catch(error => {
        if (finallyFn) finallyFn(error)
        // js exceptions cant be serialized as normal strings, so just post the error message in that case
        const serializableError = error.stack ? {message: error.message} : error
        return post(type + '-reject', serializableError, true)
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

// listenThenPost('raml-suggest', data => ramlSuggest.suggestions(data.content, data.cursorPosition))

listenThenPost('spec-convert', data => converter(data.path, data.from, data.to, data.format))

listen('request-file', data => responseFile(data.path, data.error, data.content))