import RemoteApi from './RemoteApi'

export default class ConsumeRemoteApi extends RemoteApi {

  queryFragments(query: string): Promise {
    return this._post(['exchange','graphql'],
      ConsumeRemoteApi.generateBody(query, "{organizationId, name, description, rating, numberOfRates, version, groupId, assetId}"), true)
  }

  addDependencies(dependencies: []): Promise {
    return this._put(['projects',this.projectId, 'exchange','dependencies'], dependencies, true)
  }

  get baseUrl() {
    return super.baseUrl
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