//@flow

import RemoteApi from './RemoteApi'
import GqlBuilder from './GqlBuilder'

import type {GAV} from '../components/modal/dependency/DependencyModel'
import type {Fragment} from '../components/modal/consume-api/Fragment'

export default class ConsumeRemoteApi extends RemoteApi {

  getLatestVersion(groupId: string, assetId: string): Promise<ConsumeResponse> {
    const list = this.authorization.split(' ')
    const params = "groupId, assetId, version, createdAt, updatedAt, name, description"

    return this._post(
      ['exchange', 'graphql'],
      new GqlBuilder(list[list.length - 1]).addParameters(params).withLatestVersion().withAsset({
        groupId,
        assetId
      }).build(),
      true
    )
  }

  queryFragments(query: string, offset: number = 0): Promise<ConsumeResponse> {

    const list = this.authorization.split(' ')
    const params = "organizationId, name, description, rating, numberOfRates, version, groupId, assetId"

    return this._post(
      ['exchange', 'graphql'],
      new GqlBuilder(list[list.length - 1]).addParameters(params).withLatestVersion().withQuery(query, offset).build(),
      true
    )
  }

  addDependencies(dependencies: GAV[]): Promise<any> {
    return this._put(['projects', this.projectId, 'exchange', 'dependencies'], dependencies, true)
  }

  changeDependencies(addDependencies: GAV[], removeDependencies: GAV[]): Promise<any> {
    return this._post(['projects', this.projectId, 'exchange', 'dependencies'], {
      add: addDependencies,
      remove: removeDependencies
    }, true)
  }

  removeDependencies(dependencies: GAV[]): Promise<any> {
    return this._delete(['projects', this.projectId, 'exchange', 'dependencies'], dependencies, true)
  }

  jobStatus(): Promise<any> {
    return this._get(['projects', this.projectId, 'exchange', 'dependencies', 'job'], {}, true)
  }

  get baseUrl(): string {
    return super.baseUrl
  }

  _headers() {
    return {
      ...super._headers(),
      'content-type': 'application/json',
      'accept': 'application/json'
    }
  }
}

export type ConsumeResponse = {
  data: {
    assets: $Shape<Fragment>[]
  },
  options: {
    body: {},
    headers: {},
    json: boolean,
    time: boolean,
    url: string
  }
}