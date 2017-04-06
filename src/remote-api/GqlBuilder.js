//@ flow

import {FRAGMENT_PROJECT} from '../bootstrap/model'

export default class GqlBuilder {

  _accessToken: string
  _onlyLatestVersion: boolean

  _query: string
  _offset: number
  _limit: number

  _asset: $Shape<Asset>

  _parameters: string

  _withAssetProp: boolean = false
  _withQueryProp: boolean = false
  _withLatestVersionProp: boolean = false

  constructor(accessToken: string) {
    this._accessToken = accessToken
  }

  withLatestVersion(onlyLatestVersion: boolean = true): GqlBuilder {
    this._withLatestVersionProp = true
    this._onlyLatestVersion = onlyLatestVersion
    return this
  }

  withAsset(asset: $Shape<Asset>): GqlBuilder {
    this._withAssetProp = true
    this._asset = asset
    return this
  }

  //TODO can add more query params (can change to object)
  withQuery(query: string = '', offset: number = 0, limit: number = 20): GqlBuilder {
    this._withQueryProp = true
    this._query = query
    this._offset = offset
    this._limit = limit
    return this
  }

  addParameters(parameters: string): GqlBuilder {
    this._parameters = parameters
    return this
  }

  _queryProp(): string {
    return this._withQueryProp
      ? `query: {searchTerm: "${this._query}", type: "${FRAGMENT_PROJECT}", offset: ${this._offset}, limit: ${this._limit}},`
      : ''
  }

  _latestVersionProp(): string {
    return this._withLatestVersionProp ? `latestVersionsOnly: ${this._onlyLatestVersion.toString()},` : ''
  }

  _assetProp(): string {
    return this._withAssetProp ? `asset: ${GqlBuilder.objectToString(this._asset)},` : ''
  }
  
  static objectToString(object: {}): string {
    const properties = Object.entries(object)
      .map((tuple) => {
        const [key, value] = tuple
        return `${key}: ${GqlBuilder.valueToString(value)}`
      })
      .join(', ');

    return `{${properties}}`
  }

  static valueToString(value: any): string {
    switch(typeof value) {
      case 'string': return `"${value}"`
      case 'object': return GqlBuilder.objectToString(value)
      case 'undefined': return 'undefined'
      default: return value.toString()
    }
  }

  build(): IQLQuery {
    return {
      'query': `{assets(${this._queryProp()}${this._assetProp()}${this._latestVersionProp()}) {${this._parameters}}}`,
      'variables': `{"accessToken": "${this._accessToken}"}`,
      'operationName': null
    }
  }
}

export type IQLQuery = {
  query: {},
  variables: {
    accessToken: string
  },
  operationName: ?string
}

export type Asset = {
  organizationId: string,
  groupId: string,
  assetId: string,
  version: string
}