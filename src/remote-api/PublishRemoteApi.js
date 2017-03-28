import {SEPARATOR} from './RemoteApi'
import RemoteApi from './RemoteApi'
import type {ProjectType} from '../bootstrap/model'

class PublishRemoteApi extends RemoteApi {

  exchange(domainGroup): Promise<ApiVersionResponse> {
    if (domainGroup !== undefined)  {
      return this._get(['exchange','?domainGroup=' + domainGroup], {})
    } else {
      return this._get(['exchange'], {})
    }
  }

  publishToExchange(name: string, version: string, tags: Array<string>, main: string, description: string,
                    assetId: string, groupId: string, type: ProjectType): Promise<PublishApiResponse> {
    return this._post(['publish', 'exchange'], {name, version, tags, main, description, assetId, groupId, type})
  }

  publishToPlatform(name: string, version: string, tags: Array<string>,
                    main: string, description: string): Promise<PublishApiResponse> {
    return this._post(['publish', 'platform'], {name, version, tags, main, description})
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