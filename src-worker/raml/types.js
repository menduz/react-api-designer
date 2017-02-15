export type RequestFileFunction = (path: string) => Promise<string>

export type CursorPosition = {
  lineNumber: number,
  column: number
}
