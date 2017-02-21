import RemoteApi, {SEPARATOR} from './RemoteApi'
import {PathMetadata, EntryMetadata, ContentData} from './VcsElements'

class VcsRemoteApi extends RemoteApi {
  constructor(baseUrl: string, projectId: string, ownerId: string, organizationId: string) {
    super(baseUrl, ownerId, organizationId)
    this.projectId = projectId
  }

  /**
   *  @return Promise with the files in the project
   */

  files(): Promise<EntryMetadata[]> {
    return this._get(['files'])
      .then(elements => elements.map(EntryMetadata.fromObject))
  }

  file(path: string): Promise<string> {
    return this._get(['files', VcsRemoteApi.vcsPathForUri(path)], false)
  }

  deleteFile(path: string): Promise {
    return this._delete(['files', VcsRemoteApi.vcsPathForUri(path)], false)
  }

  moveFile(from: string, to: string): Promise {
    return this._post(['files', VcsRemoteApi.vcsPathForUri(from), 'move'], new PathMetadata(VcsRemoteApi.vcsPath(to)))
  }

  save(files: ContentData[]): Promise<EntryMetadata[]> {
    return this._post(['save'], files)
      .then(elements => elements.map(EntryMetadata.fromObject))
  }

  logs(): Promise {
    return this._get(['logs'])
  }

  log(logId: string): Promise {
    return this._get(['logs', logId])
  }

  fileLogs(path: string): Promise {
    return this._get(['files', VcsRemoteApi.vcsPathForUri(path), 'logs'])
  }

  fileLog(path: string, logId: string): Promise {
    return this._get(['files', VcsRemoteApi.vcsPathForUri(path), 'logs', logId])
  }

  _baseProjectUrl(): string {
    return [super._baseProjectUrl(), 'projects', this.projectId].join(SEPARATOR)
  }
}

export default VcsRemoteApi