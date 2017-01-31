//@flow

import RepositoryContainer from '../../RepositoryContainer'
import Repository from '../Repository'

export const nextName = (name: string, repositoryContainer: RepositoryContainer): string => {
  let result = name
  if (result && repositoryContainer.isLoaded) {
    const repository: Repository = repositoryContainer.repository
    for (let i = 1; repository.getByPathString(result) != null; i++) {
      result = i + '-' + name
    }
  }
  return result;
}