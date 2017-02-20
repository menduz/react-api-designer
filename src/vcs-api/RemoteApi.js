import request from 'browser-request'

const PATCH = 'PATCH'
const POST = 'POST'
const GET = 'GET'
const DELETE = 'DELETE'
const PUT = 'PUT'
export const SEPARATOR = '/'

class RemoteApi {

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  _get(pathElements: string[], parseResult: ?boolean): Promise {
    return this._request(GET, pathElements, undefined, parseResult)
  }

  _delete(pathElements: string[], parseResult: ?boolean): Promise {
    return this._request(DELETE, pathElements, undefined, parseResult)
  }

  _post(pathElements: string[], body: {}, parseResult: ?boolean): Promise {
    return this._request(POST, pathElements, body, parseResult)
  }

  _patch(pathElements: string[], body: {}, parseResult: ?boolean): Promise {
    return this._request(PATCH, pathElements, body, parseResult)
  }

  _put(pathElements: string[], body: {}, parseResult: ?boolean): Promise {
    return this._request(PUT, pathElements, body, parseResult)
  }

  _request(method, pathElements, body: {}, parseResult: ?boolean): Promise {
    return new Promise((resolve, reject) => {
      const url = this._url(pathElements)
      const headers = this._headers()
      request(RemoteApi.requestOptions(method, url, headers, body, parseResult),
        (error, response, body) => {
          if (RemoteApi._isError(error, response))
            reject(RemoteApi._extractError(error, response))
          else resolve(body)
        })
    })
  }

  static _extractError(error, response) {
    return error ||
      {
        status: response.statusCode,
        statusText: response.statusText,
        body: response.body
      }
  }

  static _isError(error, response) {
    return error || (response.statusCode < 200 || response.statusCode >= 300)
  }

  _url(elements): string {
    return this._baseProjectUrl() + SEPARATOR + elements.join(SEPARATOR)
  }

  _baseProjectUrl(): string {
    return this.baseUrl
  }

  //noinspection JSMethodCanBeStatic
  _headers() {
    return {}
  }

  static requestOptions(method: string, url: string, headers: {}, body: {}, parseResult: boolean = true) {
    return {
      method: method,
      uri: url,
      json: parseResult,
      body: body || {},
      headers: headers
    }
  }
}

export default RemoteApi