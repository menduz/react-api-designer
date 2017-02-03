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

export const getFirstLine = (raml): string => {
  return raml.split(/\r\n|\n/)[0];
}

export const isRamlFile = (name): string =>  {
  return name.endsWith('.raml');
}

export const isApiDefinition = (raml): string => {
  return /^#%RAML\s(0\.8|1\.0)\s*$/.test(getFirstLine(raml));
}
