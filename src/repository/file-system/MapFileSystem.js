// @flow

import FileSystem from './FileSystem'
import type {Path, Entry, FileData} from './FileSystem'

export type MapEntry = {
  name: string,
  path: string,
  type: 'folder' | 'file',
  meta: ?{[key: string]: any},
  children: ?MapEntry[],
  content: ?string
}

const mapEntry = (name: string, path: string, type: 'folder' | 'file',
                           meta: ?{[key: string]: any}, children: ?MapEntry[], content: ?string): MapEntry => ({
  name, path, type, meta, children, content
})

const mapFolderEntry = (name: string, path: string, children: MapEntry[], meta: ?{[key: string]: any}): MapEntry =>
  mapEntry(name, path, FileSystem.FolderEntryType, meta || {}, children, undefined)

const mapFileEntry = (name: string, path: string, content: string, meta: ?{[key: string]: any}): MapEntry =>
  mapEntry(name, path, FileSystem.FileEntryType, meta || {}, undefined, content)

const toEntry = (entry: MapEntry): Entry => {
  const children = entry.children && entry.children.map(toEntry)

  return {
    name: entry.name,
    path: entry.path,
    type: entry.type,
    meta: entry.meta,
    children
  }
}

class MapHelper {
  forEach(fn: (entry: MapEntry) => void): void { throw new Error('Not implemented method')}

  has(path: Path): boolean { throw new Error('Not implemented method')}

  set(path: Path, content: MapEntry): void { throw new Error('Not implemented method')}

  get(path: Path): ?MapEntry { throw new Error('Not implemented method')}

  remove(path: Path): void { throw new Error('Not implemented method')}
}

type ValidationResult = {
  valid: boolean,
  reason?: string
}

class MapFileSystem extends FileSystem {
  _mapHelper: MapHelper
  _delay: number

  constructor(mapHelper: MapHelper, delay: number = 500) {
    super()
    this._mapHelper = mapHelper
    this._delay = delay
  }

  get persistsEmptyFolders(): boolean { return true }

  _fileNotFoundMessage(path: Path): string { return `file with path="${path}" does not exist` }

  _addChildren(entry: MapEntry, fn: (path: Path) => MapEntry[]): void {
    if (entry.type === FileSystem.FolderEntryType)
      entry.children = fn(entry.path)
  }

  _findFolder(path: Path): ?MapEntry {
    let entries: MapEntry[] = []
    this._mapHelper.forEach((entry) => {
      if (entry.path.toLowerCase() === path.toLowerCase()) {
        this._addChildren(entry, this._findFiles.bind(this))
        entries.push(entry)
      }
    })
    return entries.length > 0 ? entries[0] : null
  }

  _findFiles(path: Path): MapEntry[] {
    if (path.lastIndexOf('/') !== path.length - 1) {
      path += '/'
    }

    let entries: MapEntry[] = []
    this._mapHelper.forEach((entry) => {
      if (entry.path.toLowerCase() !== path.toLowerCase() &&
        this._extractParentPath(entry.path) + '/' === path) {
        this._addChildren(entry, this._findFiles.bind(this))
        entries.push(entry)
      }
    })
    return entries
  }

  /**
   *
   * Save in localStorage entries.
   *
   * dirty structure are objects that contain the following attributes:
   * * path: The full path (including the filename).
   * * content: The content of the file (only valid for files).
   * * isFolder: A flag that indicates whether is a folder or file.
   */
  static delay = 500

  _validatePath(path: Path): ValidationResult {
    return path.indexOf('/') !== 0 ?
      {valid: false, reason: 'Path should start with "/"'} :
      {valid: true}
  }

  _isValidParent(path: Path): boolean {
    const parent = this._extractParentPath(path)
    return this._mapHelper.has(parent) || parent === ''
  }

  _hasChildren(path: Path): boolean {
    let has = false
    this._mapHelper.forEach((entry) => {
      if (entry.path.indexOf(path + '/') === 0) {
        has = true
      }
    })
    return has
  }

  _extractNameFromPath(path: Path): string {
    if (!this._validatePath(path).valid) throw new Error('Invalid Path!')

    // When the path is ended in '/'
    path = path.lastIndexOf('/') === path.length - 1 ? path.slice(0, -1) : path

    return path.slice(path.lastIndexOf('/') + 1)
  }

  _extractParentPath(path: Path): Path {
    if (!this._validatePath(path).valid) throw new Error('Invalid Path!')

    // When the path is ended in '/'
    path = path.lastIndexOf('/') === path.length - 1 ? path.slice(0, -1) : path

    return path.slice(0, path.lastIndexOf('/'))
  }

  /**
   * List files found in a given path.
   */
  directory(path: Path): Promise<Entry> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this._loadDirectory(path))
      }, this._delay)
    })
  }

  _loadDirectory(path: Path): Entry {
    if (!this._validatePath(path).valid)
      throw new Error(this._validatePath(path).reason)

    if (!this._mapHelper.has('/')) {
      this._mapHelper.set(path, mapEntry(
        '',
        '/',
        'folder',
        {'created': Math.round(new Date().getTime() / 1000.0)},
        undefined,
        undefined
      ))
    }

    const folder = this._findFolder(path)
    if(!folder) throw new Error(`Folder does not exists: ${path}`)
    return toEntry(folder)
  }

  /**
   * Persist a file to an existing folder.
   */
  save(files: FileData[]): Promise<Entry> {
    return new Promise((resolve) => {
      setTimeout(() => {
        files.forEach((f) => this.saveFile(f))
        resolve(this._loadDirectory('/'))
      }, this._delay)
    })
  }

  saveFile(fileData: FileData) {
    const {path, content} = fileData
    const name: string = this._extractNameFromPath(path)
    const entry: ?MapEntry = this._mapHelper.get(path)

    if (!this._isValidParent(path))
      throw new Error(`Parent folder does not exists: ${path}`)

    let file: MapEntry
    if (entry) {
      if (entry.type === FileSystem.FolderEntryType)
        throw new Error('file has the same name as a folder')

      const meta = entry.meta || {}
      if (meta)
        meta['lastUpdated'] = Math.round(new Date().getTime() / 1000.0)

      file = {
        ...entry,
        content,
        meta
      }
    } else {
      file = mapEntry(
        name,
        path,
        'file',
        {'created': Math.round(new Date().getTime() / 1000.0)},
        undefined,
        content
      )
    }

    this._mapHelper.set(path, file)
  }

  /**
   * Create the folders contained in a path.
   */
  createFolder(path: Path): Promise<any> {
    return new Promise((resolve, reject) => {
      const isValidPath: ValidationResult = this._validatePath(path)

      if (!isValidPath.valid)
        return reject(isValidPath.reason)

      if (this._mapHelper.has(path))
        return reject(new Error('Folder already exists: ' + path))

      if (!this._isValidParent(path))
        return reject(new Error('Parent folder does not exists: ' + path))

      setTimeout(() => {
        this._mapHelper.set(path, mapEntry(
          this._extractNameFromPath(path),
          path,
          'folder',
          {
            'created': Math.round(new Date().getTime() / 1000.0)
          },
          undefined,
          undefined
        ))

        resolve()
      }, this._delay)
    })
  }

  /**
   * Loads the content of a file.
   */
  load(path: Path): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let entry: ?MapEntry = this._mapHelper.get(path)
        if (entry && entry.type === 'file') {
          resolve(entry.content || '')
        } else {
          reject(this._fileNotFoundMessage(path))
        }
      }, this._delay)
    })
  }

  /**
   * Removes a file or directory.
   */
  remove(path: Path): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let entry: ?MapEntry = this._mapHelper.get(path)

        if (entry &&
          entry.type === FileSystem.FolderEntryType &&
          this._hasChildren(path)) {
          reject('folder not empty')
          return //deferred.promise
        }

        this._mapHelper.remove(path)
        resolve()
      }, this._delay)
    })
  }

  /**
   * Renames a file or directory
   */
  rename(source: Path, destination: Path, isDirectory: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const sourceEntry: ?MapEntry = this._mapHelper.get(source)

        if (!sourceEntry)
          return reject('Source file or folder does not exists.')

        const destinationEntry: ?MapEntry = this._mapHelper.get(destination)
        if (destinationEntry)
          return reject('dirty or folder already exists.')

        if (!this._isValidParent(destination))
          return reject('Destination folder does not exist.')

        sourceEntry.path = destination
        sourceEntry.name = this._extractNameFromPath(destination)

        this._mapHelper.remove(destination)
        this._mapHelper.remove(source)
        this._mapHelper.set(destination, sourceEntry)

        if (sourceEntry.type === FileSystem.FolderEntryType) {
          //move all child items
          this._mapHelper.forEach((entry) => {
            if (entry.path.toLowerCase() !== source.toLowerCase() &&
              entry.path !== destination &&
              entry.path.indexOf(source) === 0) {
              let newPath = destination + entry.path.substring(source.length)
              this._mapHelper.remove(entry.path)
              entry.path = newPath
              this._mapHelper.set(newPath, entry)
            }
          })
        }

        resolve()
      }, this._delay)
    })
  }
}

export default MapFileSystem

export {
  MapHelper,
  mapEntry,
  mapFileEntry,
  mapFolderEntry
}