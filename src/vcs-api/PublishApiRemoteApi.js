import {SEPARATOR} from './RemoteApi'
import ExchangeApi from './ExchangeApi'
import type {XApiDataProvider} from './XApiDataProvider'

class PublishApiRemoteApi extends ExchangeApi {

  constructor(data: XApiDataProvider) {
    super(data)
  }

  getLastVersion(): Promise<ApiVersionResponse> {
    // return new Promise((resolve) => {
    //   resolve({
    //     name: 'Juan',
    //     version: '1.0',
    //     groupId: 'juan.longo',
    //     assetId: 'com.some',
    //     mainFile: 'api.raml',
    //     tags: Array.of('juan', 'wait', 'for', 'it', '...', 'Longo')
    //   })
    // })
    return this._get(['getLastVersion'], {}) //TODO add data
  }

  publishToExchange(name: string, version: string, tags: Array<string>,
                    mainFile: string, assetId: string, groupId: string): Promise<PublishApiResponse> {
    return this._post(['publish', 'exchange'], {name, version, tags, mainFile, assetId, groupId})
  }

  publishToPlatform(name: string, version: string, tags: Array<string>): Promise<PublishApiResponse> {
    return this._post(['publish', 'platform'], {name, version, tags})
  }

  _baseProjectUrl(): string {
    return [super._baseProjectUrl(), 'projects', this.projectId].join(SEPARATOR)
  }

  _headers() {
    return {
      ...super._headers(),
      'apiplatform-organization-id': this.organizationId
    }
  }
}

export type PublishApiResponse = {
  apiId: string,
  apiName: string,
  versionId: string,
  versionName: string
}

export type ApiVersionResponse = {
  assetId: ?string,
  groupId: ?string,
  apiName: ?string,
  main: ?string,
  version: ?string
}

export default PublishApiRemoteApi