//@flow

export type State = {
  selectValue: string,
  showModal: boolean,
  showConflictModal:boolean,
  isImporting: boolean,
  fileToImport?: any,
  fileNameToImport?:string,
  fileType?:string
  url?: string
}
