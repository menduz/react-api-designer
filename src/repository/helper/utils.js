//@flow

import {Path, Directory, Repository} from '../../repository'

import type {RepositoryContainer} from '../../types'

function getDirectoryOrRoot(repository: Repository, path: ?Path): Directory {
  if (path) {
    const directory = repository.getDirectoryByPath(path)
    if (directory) return directory
  }

  return repository.root
}

export const nextName = (name: string, repositoryContainer: RepositoryContainer, path: ?Path): string => {
  let result = name
  if (result && repositoryContainer.isLoaded) {
    const repository: Repository = repositoryContainer.repository
    const parent = getDirectoryOrRoot(repository, path);

    for (let i = 1; !!parent.getByPath(Path.fromString(result)); i++) {
      result = i + '-' + name
    }
  }
  return result;
}

export type Tuple<A, B> = {first: A, second: B}

export const zipArrays = <A, B>(a: A[], b: B[], ): Tuple<A, B>[] => {
  const length = Math.min(a.length, b.length)
  const result = []
  for (let i = 0; i < length; i++) {
    result.push({first: a[i], second: b[i]})
  }
  return result
}
