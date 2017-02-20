import RemoteApi from './RemoteApi'

export default class ConsumeRemoteApi extends RemoteApi {

  constructor(baseUrl: string) {
    super(baseUrl)
  }

  queryFragments(query: string): Promise {
    return this._post([],
      ConsumeRemoteApi.generateBody(query, "{organizationId, name, description, rating, numberOfRates, version, groupId, assetId}"), true)
  }

  _headers() {
    return {
      'content-type': 'application/json',
      'accept': 'application/json'
    }
  }

  static generateBody(query: string = '', params: string = '', accessToken: string = '') {
    return {
      'query': `{assets(query: {searchTerm: "${query}"}) ${params}}`,
      'variables': `{"accessToken":"${accessToken}"}`,
      'operationName': null
    }
  }
}