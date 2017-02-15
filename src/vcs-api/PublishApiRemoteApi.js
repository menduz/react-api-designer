import RemoteApi, {SEPARATOR} from './RemoteApi'

class PublishApiRemoteApi extends RemoteApi {
  constructor(baseUrl: string, projectId: string, ownerId: string, organizationId: string, authorization: string) {
    super(baseUrl, ownerId, organizationId, authorization)
    this.projectId = projectId
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
}

export type PublishApiResponse = {
  apiId: string,
  apiName: string,
  versionId: string,
  versionName: string
}

export default PublishApiRemoteApi