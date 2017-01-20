import request from 'request'


export default class MockingServiceClient {

  constructor(baseUri, proxy) {
    // self.baseUri = 'http://mocksvc.mulesoft.com';
    this.baseUri = baseUri || 'http://ec2-52-201-242-128.compute-1.amazonaws.com';
    this.proxy = proxy
    this.url = this.buildURL()
  }

  buildURL() {
    var url   = this.baseUri + ['/mocks'].concat(Array.prototype.slice.call(arguments, 0)).join('/');
    var proxy = proxy;

    // if (proxy) {
    //   url = proxy + resolveUri(url);
    // }

    return url
  }

  static cleanBaseUri(mock) {
    var baseUri       = mock.baseUri;
    var mocksQuantity = baseUri.match(/mocks\//g).length;

    if (mocksQuantity > 1) {
      var mocks = 'mocks/';

      for (var i = mocksQuantity; i > 1; i--) {
        var from  = baseUri.indexOf(mocks);
        var to    = baseUri.indexOf('/', from + mocks.length);
        baseUri   = baseUri.substring(0, from) + baseUri.substring(to + 1, baseUri.length);
      }

    }
    mock.baseUri = baseUri;
  }

  static simplifyMock(mock) {
    if (mock.baseUri) { MockingServiceClient.cleanBaseUri(mock); }

    return {
      id:        mock.id,
      baseUri:   mock.baseUri,
      manageKey: mock.manageKey
    };
  };

  getMock(mock) {
    const that = this
    return new Promise(function (resolve, reject) {
      request(this.buildURL(mock.id, mock.manageKey), function (error, response, body) {
        if (!error) {
          resolve (MockingServiceClient.simplifyMock(body))
        } else {
          reject(error)
        }
      })
    })
  }

  createMock(mock) {
    const options = {
      url: this.buildURL(),
      time: true,
      json: true,
      body: mock
    }

    return new Promise(function (resolve, reject) {
      request.post(options, function (error, response, body) {
        if (!error) {
          console.log(body)
          const json = body
          resolve({
            id: json.id,
            manageKey: json.manageKey,
            baseUri: json.baseUri,
            manageUri: json.manageUri
          })
        } else {
          reject(error)
        }
      })
    })
  };

  updateMock(mock) {
    const options = {
      url: this.buildURL(mock.id, mock.manageKey),
      time: true,
      json: true,
      body: {raml: mock.raml, json: mock.json}
    }
    return new Promise(function (resolve, reject) {
      request.patch(options, function (error, response, body) {
        if (!error) {
          // return this.simplifyMock(angular.extend(mock, response.data));
          resolve(MockingServiceClient.simplifyMock(Object.assign(mock, body)))
        } else {
          reject(error)
        }
      })
    })

  };

  deleteMock(mockId, manageKey) {
    const url = this.buildURL(mockId, manageKey)
    return new Promise(function (resolve, reject) {
      request.del(url, function (error, response, body) {
        if (!error) {
          resolve(body)
        } else {
          reject(error)
        }
      })
    })
  }
}
