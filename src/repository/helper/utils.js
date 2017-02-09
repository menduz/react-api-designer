//@flow

import RepositoryContainer from '../../RepositoryContainer'
import {Path, Directory, Repository} from '../../repository'

export const nextName = (name: string, repositoryContainer: RepositoryContainer, path: ?Path): string => {
  let result = name
  if (result && repositoryContainer.isLoaded) {
    const repository: Repository = repositoryContainer.repository
    const parent: Repository | Directory = path ? repository.getDirectoryByPath(path) : repository

    for (let i = 1; parent.getByPath(Path.fromString(result)) != null; i++) {
      result = i + '-' + name
    }
  }
  return result;
}

