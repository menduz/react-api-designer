//@flow

export type State = {
  selectValue: string,
  showModal: boolean,
  showConflictModal: boolean,
  showZipConflictModal: boolean,
  zipFiles: Array,
  isImporting: boolean,
  fileToImport?: any,
  fileNameToImport?: string,
  fileType?: string,
  url?: string,
  error: string
}
