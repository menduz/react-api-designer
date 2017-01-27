//@flow

import {Repository} from '../repository'

type Action = {type: any} | (d: Dispatch, gS: GetState, eA: ExtraArgs) => void

export type GetState = () => {[key: string]: any}
export type ExtraArgs = {repositoryContainer: {repository: Repository}}
export type Dispatch = (action: Action) => void
