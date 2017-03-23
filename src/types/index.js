//@flow

import {Repository} from '../repository'
import Worker from '../worker'

export type GetState = () => {[key: string]: any}

export type RepositoryContainer =
  { isLoaded: false } | { repository: Repository, isLoaded: true }

export type DesignerUrls = {
  remoteApi: string,
  worker: string,
  console: string,
  vs: string,
  vsLoader: string
}

export type AuthSelectors = {
  authorization: (state: any) => string,
  ownerId: (state: any) => string,
  organizationId: (state: any) => string,
  organizationDomain: (state: any) => string
}

export type RemoteApiSelectors = {
  projectId: () => string,
  baseUrl: () => string,
  authorization: () => string,
  ownerId: () => string,
  organizationId: () => string,
  organizationDomain: () => string
}

export type ExtraArgs = {
  repositoryContainer: RepositoryContainer,
  designerWorker: Worker,
  designerRemoteApiSelectors: (gS: GetState) => RemoteApiSelectors
}

// eslint-disable-next-line
type Action = {type: any} | (d: Dispatch, gS: GetState, eA: ExtraArgs) => any
export type Dispatch = (action: Action) => any
