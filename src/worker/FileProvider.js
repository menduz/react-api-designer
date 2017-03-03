import {RepositoryContainer} from '../types'

export default class FileProvider {
  repositoryContainer: RepositoryContainer

  constructor(repositoryContainer) {
    this.repositoryContainer = repositoryContainer
  }

  getFile(path): Promise<string> {
    const repository = this.repositoryContainer.repository;
    const byPathString = repository && repository.getByPathString(path)
    if (byPathString && !byPathString.isDirectory()) {
      const file = byPathString.asFile()
      try {
        return file.getContent()
      } catch (e) {
        // todo (javok) file.getContent() should return a failed promise, never an error
        return Promise.reject(`${e.message}: ${path}`)
      }
    } else {
      return Promise.reject(`File not found: ${path}`)
    }
  }
}