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
      return file.getContent()
    } else {
      return Promise.reject('')
    }
  }
}