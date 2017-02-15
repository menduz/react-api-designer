import request from 'browser-request';

const POST = 'POST'
const GET = 'GET'
const DELETE = 'DELETE'
const PUT = 'PUT'
export const SEPARATOR = '/';

class RemoteApi {
  constructor(baseUrl: string, ownerId: string, organizationId: string, authorization?: string) {
    this.baseUrl = baseUrl
    this.ownerId = ownerId
    this.organizationId = organizationId
    this.authorization = authorization
  }

  _get(pathElements: string[]): Promise {
    return this._request(GET, pathElements)
  }

  _delete(pathElements: string[]): Promise {
    return this._request(DELETE, pathElements)
  }

  _post(pathElements: string[], body: {}): Promise {
    return this._request(POST, pathElements, body)
  }

  _request(method, pathElements, body: {}): Promise {
    return new Promise((resolve, reject) => {
      const url = this._url(pathElements);
      const headers = this._vcsHeaders();
      request(RemoteApi.requestOptions(method, url, headers, body),
        (error, response, body) => {
          if (error) reject(error)
          else resolve(RemoteApi._resolveBody(body))
        })
    });
  }

  static _resolveBody(body) {
    if (body === undefined && body === null) return
    if (typeof body === 'object') return body
    try {
      return RemoteApi._resolveBody(JSON.parse(body))
    } catch (e) {
      return body
    }
  }

  _url(elements): string {
    return this._baseProjectUrl() + SEPARATOR + elements.join(SEPARATOR)
  }

  _baseProjectUrl(): string {
    return this.baseUrl
  }

  _vcsHeaders() {
    return {
      'x-owner-id': this.ownerId,
      'x-organization-id': this.organizationId,
      'Authorization': this.authorization
    }
  }

  static requestOptions(method: string, url: string, headers: {}, body: {}) {
    return {
      method: method,
      uri: url,
      json: body,
      headers: headers
    }
  }

  static vcsPath(path: string) {
    return path.startsWith('/') ? path.slice(1) : path;
  }

  static vcsPathForUri(path: string) {
    const relativePath = RemoteApi.vcsPath(path);
    return RemoteApi.scapeVcsPath(relativePath)
  }

  static scapeVcsPath(path: string) {
    return path.replace('/', '%5C')
  }
}

export default RemoteApi