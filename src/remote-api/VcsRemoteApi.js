import {SEPARATOR} from './RemoteApi'
import RemoteApi from './RemoteApi'
import {PathMetadata, EntryMetadata, ContentData} from './VcsElements'

class VcsRemoteApi extends RemoteApi {

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

  get baseUrl() {
    return [super.baseUrl, 'projects', this.projectId].join(SEPARATOR)
  }

  static vcsPath(path: string) {
    return path.startsWith('/') ? path.slice(1) : path;
  }

  static vcsPathForUri(path: string) {
    const relativePath = VcsRemoteApi.vcsPath(path);
    return VcsRemoteApi.scapeVcsPath(relativePath)
  }

  static scapeVcsPath(path: string) {
    return path.replace(/\//g, '%5C')
  }
}

export default VcsRemoteApi