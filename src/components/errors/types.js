// @flow

export type Issue = {
  endColumn: number,
  endLineNumber: number,
  isWarning: boolean,
  message: string,
  path: string,
  startColumn: number,
  startLineNumber: number,
  trace: Issue[]
}
