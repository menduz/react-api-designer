import request from 'browser-request'
import type {RemoteApiDataProvider} from './model'

const POST = 'POST'
const PUT = 'PUT'
const GET = 'GET'
const DELETE = 'DELETE'
export const SEPARATOR = '/'

class RemoteApi {
  constructor(dataProvider: RemoteApiDataProvider) {
    this.dataProvider = dataProvider
  }

  get baseUrl() {
    return this.dataProvider.baseUrl()
  }

  get ownerId() {
    return this.dataProvider.ownerId()
  }

  get organizationId() {
    return this.dataProvider.organizationId()
  }

  get authorization() {
    return this.dataProvider.authorization()
  }

  get projectId() {
    return this.dataProvider.projectId()
  }

  _get(pathElements: string[], jsonResult: ?boolean): Promise {
    return this._request(GET, pathElements, undefined, jsonResult)
  }

  _delete(pathElements: string[], jsonResult: ?boolean): Promise {
    return this._request(DELETE, pathElements, undefined, jsonResult)
  }

  _post(pathElements: string[], body: {}, jsonResult: ?boolean): Promise {
    return this._request(POST, pathElements, body, jsonResult)
  }

  _put(pathElements: string[], body: {}, jsonResult: ?boolean): Promise {
    return this._request(PUT, pathElements, body, jsonResult)
  }

  _request(method, pathElements, body: {}, jsonResult: ?boolean): Promise {
    return new Promise((resolve, reject) => {
      const url = this._url(pathElements)
      const headers = this._headers()
      request(RemoteApi.requestOptions(method, url, headers, body, jsonResult),
        (error, response, body) => {
          if (error) reject(error)
          else if (RemoteApi._isError(response)) reject(RemoteApi._extractError(response))
          else resolve(RemoteApi._resolveBody(body, jsonResult))
        })
    })
  }

  static _resolveBody(body, jsonResult: ?boolean) {
    if (body === undefined || body === null || body === '') return
    try {
      if (typeof body === 'object')
        return jsonResult === false ? JSON.stringify(body, null, 2) : body

      return RemoteApi._resolveBody(JSON.parse(body), jsonResult)
    } catch (e) {
      return body
    }
  }

  static _extractError(response) {
    return {
      status: response.statusCode,
      statusText: response.statusText,
      body: response.body
    }
  }

  static _isError(response) {
    return response.statusCode < 200 || response.statusCode >= 300
  }

  _url(elements): string {
    return this.baseUrl + SEPARATOR + elements.join(SEPARATOR)
  }

  _headers() {
    return {
      'Authorization': this.authorization,
      'x-organization-id': this.organizationId,
      'x-owner-id': this.ownerId,
    }
  }

  static requestOptions(method: string, url: string, headers: {}, body: {}, jsonResult: boolean = true) {
    return {
      method: method,
      uri: url,
      json: jsonResult,
      body: body || {},
      headers: headers
    }
  }
}

export default RemoteApi