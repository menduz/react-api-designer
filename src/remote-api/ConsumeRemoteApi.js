import RemoteApi from './RemoteApi'

export default class ConsumeRemoteApi extends RemoteApi {

  queryFragments(query: string): Promise {

    const list = this.authorization.split(' ')

    return this._post(['exchange','graphql'],
      ConsumeRemoteApi.generateBody(query, "{organizationId, name, description, rating, numberOfRates, version, groupId, assetId}", list[list.length - 1]), true)
  }

  addDependencies(dependencies: []): Promise {
    return this._put(['projects',this.projectId, 'exchange','dependencies'], dependencies, true)
  }

  removeDependencies(dependencies: []): Promise {
    return this._delete(['projects',this.projectId, 'exchange','dependencies'], dependencies, true)
  }

  jobStatus(): Promise {
    return this._get(['projects',this.projectId, 'exchange','dependencies', 'job'], {}, true)
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