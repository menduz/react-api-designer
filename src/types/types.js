//@flow

import {Repository} from '../repository'
import type {XApiDataProvider} from '../vcs-api/XApiDataProvider'

type Action = {type: any} | (d: Dispatch, gS: GetState, eA: ExtraArgs) => void

export type GetState = () => {[key: string]: any}
export type ExtraArgs = {
  repositoryContainer: {repository: Repository},
  contextProvider: XApiDataProvider
}
export type Dispatch = (action: Action) => void
