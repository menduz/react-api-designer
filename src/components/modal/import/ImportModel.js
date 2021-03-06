//@flow

export type State = {
  selectValue: string,
  showModal: boolean,
  showConflictModal: boolean,
  showZipConflictModal: boolean,
  zipFiles: any[],
  zipWithDependencies: boolean,
  allFilesAction?: any,
  zipFileAction?: any,
  isImporting: boolean,
  fileToImport?: any,
  fileNameToImport: string,
  fileType?: string,
  url?: string,
  error: string
}
