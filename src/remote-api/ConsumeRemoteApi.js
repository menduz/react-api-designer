import RemoteApi from './RemoteApi'
import type {XApiDataProvider} from 'XApiDataProvider'

export default class ConsumeRemoteApi extends RemoteApi {

  queryFragments(query: string): Promise {
    return this._post([],
      ConsumeRemoteApi.generateBody(query, "{organizationId, name, description, rating, numberOfRates, version, groupId, assetId}"), true)
  }

  get baseUrl() {
    return super.baseUrl + '/exchange/graphql'
  }

  _headers() {
    return {
      ...super._headers(),
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