// @flow

export type State = {
  form: {[key: string]: string},
  isFetching: boolean,
  isFetched: boolean,
  link?: string,
  error?: string
}
