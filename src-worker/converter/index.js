//@flow

import converter from 'oas-raml-converter'
import request from 'browser-request'
import {language, OAS} from '../../src/repository/helper/extensions'

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

  convertUrlToRaml(url) {
    const toRaml = new converter.Converter(converter.Formats.AUTO, converter.Formats.RAML10)
    return toRaml.convertFile(url)
  }

  convertSwaggerToRaml(files: Array) {
    const toRaml = new converter.Converter(converter.Formats.SWAGGER, converter.Formats.RAML10)


    function toAbsolute(path) {
      return path.indexOf('http') !== 0 ? 'http://zip/' + path : path;
    }

    function toRelative(path) {
      return path.indexOf('http://zip/') === 0 ? path.substring('http://zip/'.length) : path;
    }


    var fsResolver = {
      canRead: function (url) {
        return this.read(url) != null;
      },
      read: function (url) {
        var path = toRelative(url.url);
        const file = files.filter(c => c.filename === path)
        if (file.length === 0) {
          throw new Error('Could not load content for file ' + path);
        }
        return file[0].content;
      }
    };

    const oasFiles = files.filter(c => {
      return language(c.filename, c.content) === OAS
    })
    if (oasFiles.length === 0) {
      return Promise.reject("Cannot find root oas file")
    }

    const rootName = oasFiles[0].filename;

    return toRaml.convertFile(toAbsolute(rootName), {
      resolve: {
        file: fsResolver,
        http: fsResolver
      }
    }).then(c => {
      return {content:c, filename: rootName}
    })
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
