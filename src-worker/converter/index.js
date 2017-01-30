import converter from 'oas-raml-converter'

export default class OasRamlConverter {

  constructor(onFileRequest, proxyUrl) {
    this.options = {
      fsResolver: {
        contentAsync: onFileRequest,
        content: path => {
          throw new Error('RamlParser should call contentAsync instead of content. File: ' + path)
        }
      },
      httpResolver: {
        getResourceAsync: url => {
          return new Promise((resolve, reject) => {

            const req = {
              url: (proxyUrl || '') + url,
              headers: {
                'Accept': 'application/raml+yaml'
              }
            }

            request(req, (err, response, body) => {
              if (err) reject(err)
              else resolve({content: body})
            })
          })
        }
      }
    }
  }

  convertToSwagger(rootPath, format) {
    const toSwagger = new converter.Converter(converter.Formats.AUTO, converter.Formats.SWAGGER)
    const o = {...this.options,
      format: format
    }

    return toSwagger.convertFile(rootPath, o)
  }

  convert(text, from, to, options) {
    return new Promise((resolve, reject) => {
      const fromFormat = converter.Formats[from];
      const toFormat = converter.Formats[to];

      const o = {...options,
        fsResolver: this.options.fsResolver,
        httpResolver: this.options.httpResolver
      }

      new converter.Converter(fromFormat, toFormat).convertData(text, o)
        .then(result => { resolve(stringify(result)) })
        .catch(error => { reject(error) })
    })
  }

}
