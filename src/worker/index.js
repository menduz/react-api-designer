import FileProvider from './FileProvider'

export default class DesignerWorker {

  constructor(url: string, fileRepository: FileProvider) {
    this.fileRepository = fileRepository
    this.url = url
    this.lazyWorker = undefined

    this.parsing = false
    this.parsingPending = false
  }

  get worker() {
    this.load()
    return this.lazyWorker
  }

  load() {
    if (!this.lazyWorker) {
      this.lazyWorker = DesignerWorker.load(this.url)

      this._listen('requestFile', (req) => {
        const path = req.path
        this.fileRepository.getFile(path).then(content => {
          this._post('requestFile', {path, content})
        }).catch(error => {
          this._post('requestFile', {path, error})
        })
      })
    }
  }

  static load(url: string) {
    const w = window
    if (w.Worker && w.Blob && w.URL) {
      const codeStr = `self.importScripts('${url}')`
      const codeBlob = new w.Blob([codeStr], {type: 'application/javascript'})
      const codeUrl = w.URL.createObjectURL(codeBlob)
      return new w.Worker(codeUrl)
    }

    return {
      postMessage: () => console.error('Could not initialize Designer Worker:',
        'Worker?', w.Worker !== undefined, '- Blob?', w.Blob !== undefined, '- URL?', w.URL !== undefined),
      addEventListener: () => false,
      removeEventListener: () => false
    }
  }

  oasParse(data) {
    return this.parse('oasParse', data)
  }

  jsonParse(data) {
    return this.parse('jsonParse', data)
  }

  ramlParse(data) {
    return this.parse('ramlParse', data)
  }

  parse(fnName, data) {
    if (this.parsing) {
      // if we already have a parse request pending, reject it as aborted
      if (this.parsingPending) this.parsingPending.reject('aborted')

      // leave the parser request as pending
      return new Promise((resolve, reject) => {
        this.parsingPending = {fnName, data, resolve, reject}
      })
    }

    this.parsing = true
    return new Promise((resolve, reject) => {
      this._postAndExpect(fnName, data).then(result => {
        resolve(result)
        this.parsePending()
      }).catch(error => {
        reject(error)
        this.parsePending()
      })
    })
  }

  parsePending() {
    this.parsing = false
    const pending = this.parsingPending
    if (pending) {
      this.parsingPending = false
      this[pending.fnName](pending.data)
        .then(pending.resolve)
        .catch(pending.reject)
    }
  }

  ramlSuggest(content, cursorPosition, path, repository) {
    return this._postAndExpect('ramlSuggest', {content, cursorPosition, path, repository})
  }

  convertAutoToSwagger(rootPath, format) {
    return this._postAndExpect('convertAutoToSwagger', {rootPath, format})
  }

  convertSwaggerUrlToRaml(rootPath) {
    return this._postAndExpect('convertSwaggerUrlToRaml', {rootPath})
  }

  convertSwaggerToRaml(files) {
    return this._postAndExpect('convertSwaggerToRaml', {files})
  }

  _listen(type, fn) {
    this.worker.addEventListener('message', (e) => {
      if (e.data.type === type) fn(e.data.payload)
    }, false)
  }

  _post(type, payload) {
    try {
      this.worker.postMessage({type, payload})
    } catch (e) {
      console.error('Error when trying to post to worker', e)
      this.worker.postMessage({type}) // send just the type, so the flow can continue
    }
  }

  _postAndExpect(type, payload) {
    return new Promise((resolve, reject) => {
      const listener = (e) => {
        if (e.data.type === type + '-resolve') {
          this.worker.removeEventListener('message', listener, false)
          resolve(e.data.payload)
        }
        else if (e.data.type === type + '-reject') {
          this.worker.removeEventListener('message', listener, false)
          reject(e.data.payload)
        }
      }
      this.worker.addEventListener('message', listener, false)

      this._post(type, payload)
    })
  }
}