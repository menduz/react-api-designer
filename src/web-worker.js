export default class WebWorker {

  constructor(fileRepository) {
    // this.parsing = new Map()
    // this.pendding = new Map()

    this.worker = new Worker(`${process.env.PUBLIC_URL}/build/static/js/api-designer-worker.js`)
    this.worker.addEventListener('message', (e) => {
      const request = e.data
      // console.log(request)

      switch (request.type) {

        case 'request-file':
          // todo use fileRepository to fetch file, not as a string
          this.worker.postMessage({
            type: 'request-file',
            path: request.path,
            content: fileRepository.getFile(request.path)
          })
          break

      }

    }, false)
  }

  parserRaml(path) {
    // const parsingPath = this.parsing.get(path);
    // if (parsingPath) {
    //   this.pendding.set(path)
    // }

    return new Promise((resolve, reject) => {

      const listener = (e) => {
        const response = e.data
        // console.log(response)

        switch (response.type) {

          case 'raml-parse-resolve':
            this.worker.removeEventListener('message', listener, false)
            resolve(response)
            break

          case 'raml-parse-reject':
            this.worker.removeEventListener('message', listener, false)
            reject(response)
            break

        }

      };

      this.worker.addEventListener('message', listener, false)

      this.worker.postMessage({ type: 'raml-parse', path})

    })
  }

}