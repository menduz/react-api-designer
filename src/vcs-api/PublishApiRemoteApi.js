import {SEPARATOR} from './RemoteApi'
import ExchangeApi from './ExchangeApi'

class PublishApiRemoteApi extends ExchangeApi {

  versions(name: string): Promise {
    return this._get(['api', name])
  }

  createVersion(name: string, version: string, tags: Array<string>): Promise<PublishApiResponse> {
    return this._post(['api', name, version], {tags})
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

export default PublishApiRemoteApi