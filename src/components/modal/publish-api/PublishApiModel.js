// @flow

export type State = {
  form: {[key: string]: string},
  isFetching: boolean,
  isFetched: boolean,
  isLoading: boolean,
  isOpen: boolean,
  publishToBothApis: boolean,
  link?: string,
  error?: string
}
