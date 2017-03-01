// @flow
import type RemoteApiDataProvider from '../remote-api/model'

export type State = {
  initializing: boolean,
  remoteApiDataProvider: ?RemoteApiDataProvider
}