import request from 'browser-request'

export default class MockingServiceClient {

  constructor(baseUri = '', proxy = '') {
    if (!baseUri) {
      baseUri = window.location.host.startsWith('localhost')
        ? 'http://ec2-52-201-242-128.compute-1.amazonaws.com'
        : '/apiplatform/proxy/https://mocksvc.mulesoft.com'
    }

    this.baseUri = baseUri
    this.proxy = proxy
    this.url = this.buildURL()
  }

  buildURL() {
    return this.baseUri + ['/mocks'].concat(Array.prototype.slice.call(arguments, 0)).join('/')
    // var proxy = proxy

    // if (proxy) {
    //   url = proxy + resolveUri(url)
    // }
  }

  static cleanBaseUri(mock) {
    let baseUri = mock.baseUri
    const mocksQuantity = baseUri.match(/mocks\//g).length

    if (mocksQuantity > 1) {
      const mocks = 'mocks/'

      for (let i = mocksQuantity; i > 1; i--) {
        const from = baseUri.indexOf(mocks)
        const to = baseUri.indexOf('/', from + mocks.length)
        baseUri = baseUri.substring(0, from) + baseUri.substring(to + 1, baseUri.length)
      }

    }
    mock.baseUri = baseUri
  }

  static simplifyMock(mock) {
    if (mock.baseUri)
      MockingServiceClient.cleanBaseUri(mock)

    return {
      id: mock.id,
      baseUri: mock.baseUri,
      manageKey: mock.manageKey
    }
  }

  getMock(mock) {
    return new Promise((resolve, reject) => {
      request(this.buildURL(mock.id, mock.manageKey), (error, response, body) =>
        error ? reject(error) : resolve(MockingServiceClient.simplifyMock(body))
      )
    })
  }

  createMock(mock) {
    const options = {
      url: this.buildURL(),
      time: true,
      json: true,
      body: mock
    }

    return new Promise((resolve, reject) => {
      request.post(options, (error, response, body) => {
        if (error) {
          reject(error)
        } else {
          const json = body

          if (json.id !== undefined) {
            resolve({
              id: json.id,
              manageKey: json.manageKey,
              baseUri: json.baseUri,
              manageUri: json.manageUri
            })
          } else {
            console.error('Cannot create mock', body)
            reject(body)
          }
        }
      })
    })
  }

  updateMock(mock) {
    const options = {
      url: this.buildURL(mock.id, mock.manageKey),
      time: true,
      json: true,
      body: {raml: mock.raml, json: mock.json}
    }
    return new Promise((resolve, reject) => {
      request.patch(options, (error, response, body) =>
        // return this.simplifyMock(angular.extend(mock, response.data))
        error ? reject(error) : resolve(MockingServiceClient.simplifyMock(Object.assign(mock, body)))
      )
    })

  }

  deleteMock(mockId, manageKey) {
    const url = this.buildURL(mockId, manageKey)
    return new Promise((resolve, reject) => {
      request.del(url, (error, response, body) =>
        error ? reject(error) : resolve(body)
      )
    })
  }
}
