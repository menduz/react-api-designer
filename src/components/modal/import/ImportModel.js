//@flow

export type State = {
  selectValue: string,
  showModal: boolean,
  showConflictModal:boolean,
  showZipConflictModal:boolean,
  allFilesAction:string,
  zipFiles:Array,
  zipFileAction:string,
  isImporting: boolean,
  fileToImport?: any,
  fileNameToImport?:string,
  fileType?:string
  url?: string
}
