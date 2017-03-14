// @flow

import type {RepositoryContainer} from '../types'
import Repository from "../repository/Repository";

export default class FileProvider {
  repositoryContainer: RepositoryContainer

  constructor(repositoryContainer: RepositoryContainer) {
    this.repositoryContainer = repositoryContainer
  }

  getFile(path: string): Promise<string> {
    if(!this.repositoryContainer.isLoaded) return Promise.reject()

    const repository: Repository = this.repositoryContainer.repository
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