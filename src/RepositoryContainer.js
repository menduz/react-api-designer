import Repository from './repository/Repository'

export type RepositoryContainer = {
  repository: ?Repository,
  isLoaded: boolean
}