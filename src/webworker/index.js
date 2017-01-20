export default class WebWorker {

  constructor(fileRepository) {
    this.worker = new Worker(`${process.env.PUBLIC_URL}/static/js/api-designer-worker.js`)

    this._listen('request-file', (request) => {
      this._post('request-file', {
        path: request.path,
        content: fileRepository.getFile(request.path)
      })
    })

    this.parsing = false
    this.parsingPending = new Map()
    this.fileRepository = fileRepository
  }

  setRepositoryContent(text) {
    this.fileRepository.setFile(text)
  }

  jsonParse(data) {
    return this.parse('json-parse', data, 'jsonParse')
  }

  ramlParse(data) {
    return this.parse('raml-parse', data, 'ramlParse', data.path)
  }

  parse(msg, data, fnName, pendingKey = msg) {
    if (this.parsing) {
      // if we already have a parse request pending, reject it as aborted
      const pending = this.parsingPending.get(pendingKey);
      if (pending) pending.reject('aborted')

      // leave the parser request as pending
      return new Promise((resolve, reject) => {
        this.parsingPending.set(pendingKey, {resolve, reject})
      })
    }

    this.parsing = true
    return new Promise((resolve, reject) => {
      this._postAndExpect(msg, data).then(result => {
        resolve(result)
        this.parsePending(data, pendingKey, fnName)
      }).catch(error => {
        reject(error)
        this.parsePending(data, pendingKey, fnName)
      })
    })
  }

  parsePending(data, pendingKey, fnName) {
    this.parsing = false
    const pending = this.parsingPending.get(pendingKey);
    if (pending) {
      this.parsingPending.delete(pendingKey)
      this[fnName](data)
        .then(pending.resolve)
        .catch(pending.reject)
    }
  }

  ramlSuggest(content, cursorPosition) {
    return this._postAndExpect('raml-suggest', {content, cursorPosition})
  }

  specConvert(path, from, to, format) {
    return this._postAndExpect('spec-convert', {path, from, to, format})
  }

  _listen(type, fn) {
    this.worker.addEventListener('message', (e) => {
      if (e.data.type === type) fn(e.data.payload);
    }, false)
  }

  _post(type, payload) {
    this.worker.postMessage({type, payload})
  }

  _postAndExpect(type, payload) {
    return new Promise((resolve, reject) => {
      const listener = (e) => {
        if (e.data.type === type + '-resolve') {
          this.worker.removeEventListener('message', listener, false)
          resolve(e.data.payload);
        }
        else if (e.data.type === type + '-reject') {
          this.worker.removeEventListener('message', listener, false)
          reject(e.data.payload);
        }
      };
      this.worker.addEventListener('message', listener, false)

      this._post(type, payload)
    })
  }
}