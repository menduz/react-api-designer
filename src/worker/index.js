import FileProvider from './FileProvider'

export default class WebWorker {

  constructor(fileRepository: FileProvider) {
    this.parsing = false
    this.parsingPending = new Map()
    this.worker = WebWorker.init()

    if (this.worker) {
      this._listen('requestFile', (req) => {
        const path = req.path;
        fileRepository.getFile(path).then(content => {
          this._post('requestFile', {path, content})
        }).catch(error => {
          this._post('requestFile', {path, error})
        })
      })
    }
  }

  static init() {
    const w = window
    if (!w.requireConfig|| !w.Blob || !w.URL  || !w.Worker) return null

    const codeStr = `self.importScripts('${w.requireConfig.worker}')`
    const codeBlob = new w.Blob([codeStr], {type: 'application/javascript'})
    const codeUrl = w.URL.createObjectURL(codeBlob)
    return new w.Worker(codeUrl)
  }

  oasParse(data) {
    return this.parse('oasParse', data)
  }

  jsonParse(data) {
    return this.parse('jsonParse', data)
  }

  ramlParse(data) {
    return this.parse('ramlParse', data, data.path)
  }

  parse(fnName, data, pendingKey = fnName) {
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
      this._postAndExpect(fnName, data).then(result => {
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

  ramlSuggest(content, cursorPosition, path, repository) {
    return this._postAndExpect('ramlSuggest', {content, cursorPosition, path, repository})
  }

  convertToSwagger(rootPath, format) {
    return this._postAndExpect('convertToSwagger', {rootPath, format})
  }

  convertUrlToRaml(rootPath) {
    return this._postAndExpect('convertUrlToRaml', {rootPath})
  }

  convertSwaggerToRaml(files) {
    return this._postAndExpect('convertSwaggerToRaml', {files})
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