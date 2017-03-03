import {SEPARATOR} from './RemoteApi'
import RemoteApi from './RemoteApi'

class PublishRemoteApi extends RemoteApi {

  getLastVersion(): Promise<ApiVersionResponse> {
    return this._get(['getLastVersion'], {})
  }

  publishToExchange(name: string, version: string, tags: Array<string>,
                    main: string, assetId: string, groupId: string): Promise<PublishApiResponse> {
    return this._post(['publish', 'exchange'], {name, version, tags, main, assetId, groupId})
  }

  publishToPlatform(name: string, version: string, tags: Array<string>): Promise<PublishApiResponse> {
    return this._post(['publish', 'platform'], {name, version, tags})
  }

  get baseUrl() {
    return [super.baseUrl, 'projects', this.projectId].join(SEPARATOR)
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

export default PublishRemoteApi