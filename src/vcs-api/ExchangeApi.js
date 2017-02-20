import RemoteApi from './RemoteApi'

class ExchangeApi extends RemoteApi {

  constructor(baseUrl: string, ownerId: string, organizationId: string, authorization?: string) {
    super(baseUrl)
    this.baseUrl = baseUrl
    this.ownerId = ownerId
    this.organizationId = organizationId
    this.authorization = authorization
  }

  _headers() {
    return {
      'x-owner-id': this.ownerId,
      'x-organization-id': this.organizationId,
      'Authorization': this.authorization
    }
  }

  static vcsPath(path: string) {
    return path.startsWith('/') ? path.slice(1) : path;
  }

  static vcsPathForUri(path: string) {
    const relativePath = ExchangeApi.vcsPath(path);
    return ExchangeApi.scapeVcsPath(relativePath)
  }

  static scapeVcsPath(path: string) {
    return path.replace(/\//g, '%5C')
  }
}

export default ExchangeApi