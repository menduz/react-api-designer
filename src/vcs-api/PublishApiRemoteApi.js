import {SEPARATOR} from './RemoteApi'
import ExchangeApi from './ExchangeApi'

class PublishApiRemoteApi extends ExchangeApi {

  constructor(baseUrl: string,
              projectId: string,
              ownerId: string,
              organizationId: string,
              apiPlatformOrganizationId: string,
              authorization: string) {
    super(baseUrl, ownerId, organizationId, authorization)
    this.projectId = projectId
    this.apiPlatformOrganizationId = apiPlatformOrganizationId
  }

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
    return Object.assign({},
      super._headers(),
      {
        'apiplatform-organization-id': this.apiPlatformOrganizationId
      }
    )
  }
}

export type PublishApiResponse = {
  apiId: string,
  apiName: string,
  versionId: string,
  versionName: string
}

export default PublishApiRemoteApi