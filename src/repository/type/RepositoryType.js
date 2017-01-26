// @flow

export type RepositoryElementType = {
  name: string,
  path: string,
  extension: ?string,
  isDirectory: boolean,
  children: ?RepositoryElementType[]
}