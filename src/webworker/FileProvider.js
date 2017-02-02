import {File} from '../repository'
import {Repository} from '../repository'

type RepositoryContainer = {
  repository: ?Repository,
  isLoaded: boolean
}

class FileProvider {
  repositoryContainer: RepositoryContainer

  constructor(repositoryContainer) {
    this.repositoryContainer = repositoryContainer
  }

  getFile(path): Promise<string> {
    const repository = this.repositoryContainer.repository;
    const byPathString = repository && repository.getByPathString(path);
    if (byPathString && !byPathString.isDirectory()) {
      const file = ((byPathString: any): File);
      return file.getContent()
    } else {
      return Promise.reject('')
    }
  }
}

export default FileProvider