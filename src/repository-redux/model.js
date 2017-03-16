// @flow

import {Map} from 'immutable'
import {RepositoryModel} from '../repository/immutable'

export type State = {
  fileTree: ?RepositoryModel,
  dependenciesTree: ?RepositoryModel,
  contents: Map<string, string>,
  progress: boolean,
  error: ?string
}