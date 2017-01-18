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

  ramlParse(path) {
    if (this.parsing) {
      // if we already have a parse request pending, reject it as aborted
      const pending = this.parsingPending.get(path);
      if (pending) pending.reject('aborted')

      // leave the parser request as pending
      return new Promise((resolve, reject) => {
        this.parsingPending.set(path, {resolve, reject})
      })
    }

    this.parsing = true
    return new Promise((resolve, reject) => {
      this._postAndExpect('raml-parse', {path}).then(result => {
        resolve(result)
        this.ramlParsePending(path)
      }).catch(error => {
        reject(error)
        this.ramlParsePending(path)
      })
    })
  }

  ramlParsePending(path) {
    this.parsing = false
    const pending = this.parsingPending.get(path);
    if (pending) {
      this.parsingPending.delete(path)
      this.ramlParse(path)
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
      if (e.data.type === type) fn(e.data);
    }, false)
  }

  _post(type, data) {
    this.worker.postMessage({...data, type})
  }

  _postAndExpect(type, data) {
    return new Promise((resolve, reject) => {
      const listener = (e) => {
        if (e.data.type === type + '-resolve') {
          this.worker.removeEventListener('message', listener, false)
          resolve(e.data);
        }
        else if (e.data.type === type + '-reject') {
          this.worker.removeEventListener('message', listener, false)
          reject(e.data);
        }
      };
      this.worker.addEventListener('message', listener, false)

      this._post(type, data)
    })
  }
}