import ramlParser from "raml-1-parser";
import request from "browser-request";

export default class RamlParser {

  constructor(onFileRequest, proxyUrl) {
    this.options = {
      attributeDefaults: true,
      rejectOnErrors: false,
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

    this.jsonOptions=  {
      serializeMetadata: false,
      dumpSchemaContents: true,
      rootNodeDetails: true
    };
  }

  parse(path) {
    return ramlParser.loadApi(path, this.options).then(api => {
      api = api.expand ? api.expand(true) : api;
      return api.toJSON(this.jsonOptions);
      // todo include ramlExpander from old api-console?
      // if (raml.specification) {
      //   ramlExpander.expandRaml(raml.specification);
      // }
    });
  }
}