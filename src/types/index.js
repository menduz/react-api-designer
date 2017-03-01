//@flow

import {Repository} from '../repository'
import Worker from '../worker'

export type RepositoryContainer = {
  repository: ?Repository,
  isLoaded: boolean
}

export type GetState = () => {[key: string]: any}

export type ExtraArgs = {
  repositoryContainer: RepositoryContainer,
  worker: Worker
}

// eslint-disable-next-line
type Action = {type: any} | (d: Dispatch, gS: GetState, eA: ExtraArgs) => void
export type Dispatch = (action: Action) => void
