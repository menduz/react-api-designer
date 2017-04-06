// @flow

import VcsRemoteApi from "../../remote-api/VcsRemoteApi";
import {EntryMetadata, ContentData} from "../../remote-api/VcsElements";

import {FileSystem, Separator, fileEntry, folderEntry} from './FileSystem'
import type {Path, Entry, FileData} from './FileSystem'

class EntryFactory {
  static fromBasicMetadata(elements: EntryMetadata[]) {
    const children = EntryFactory.entriesInPath(elements, '', 0)
    return folderEntry('', Separator, children)
  }

  static entriesInPath(items: EntryMetadata[], path: string, level: number): Entry[] {
    if (items.length === 0) return []

    const deeperItems = items
      .filter(e => e.pathMembers().length > level + 1)

    const validItems = items
      .filter(e => e.pathMembers().length === level + 1)
      .filter(f => f.path.startsWith(path))

    const folders: Entry[] = validItems
      .filter(e => e.type === EntryMetadata.FOLDER)
      .map(e => EntryFactory.folderEntry(e, deeperItems))

    const files: Entry[] = validItems
      .filter(e => e.type === EntryMetadata.FILE)
      .map(e => EntryFactory.fileEntry(e))

    return folders.concat(files)
  }

  static folderEntry(metadata: EntryMetadata, deeperItems: EntryMetadata[]): Entry {
    const name = metadata.name();
    const path = Separator + metadata.path;
    const children = EntryFactory.entriesInPath(deeperItems, metadata.path, metadata.pathLength());

    return folderEntry(name, path, children)
  }

  static fileEntry(metadata: EntryMetadata): Entry {
    const name = metadata.name();
    const path = Separator + metadata.path;

    return fileEntry(name, path)
  }
}

class VcsFileSystem implements FileSystem {
  _vcsApi: VcsRemoteApi

  constructor(vcsApi: VcsRemoteApi) {
    this._vcsApi = vcsApi
  }

  directory(path: Path): Promise<Entry> {
    return this._vcsApi.files()
      .then(EntryFactory.fromBasicMetadata)
  }

  save(entries: FileData[], commit: boolean = true): Promise<Entry> {
    const data = entries
      .map((entry) => new ContentData(entry.path, entry.content))
    return this._vcsApi.save(data, commit)
      .then(EntryFactory.fromBasicMetadata)
  }

  createFolder(path: Path) {
    return Promise.resolve()
  }

  load(path: Path): Promise<string> {
    return this._vcsApi.file(path)
      .then(result => {
        if (result === undefined) {
          return Promise.reject('Cannot load file ' + path )
        }
        if (result.status && result.status === 404) return Promise.reject(result.message)
        return Promise.resolve(result)
      })
  }

  remove(path: Path) {
    return this._vcsApi.deleteFile(path)
  }

  rename(source: Path, destination: Path, isDirectory: boolean) {
    if (isDirectory) return Promise.resolve()
    return this._vcsApi.moveFile(source, destination)
  }

  persistsEmptyFolders(): boolean { return false }

  clean(): Promise<any> { return this._vcsApi.clean() }
}

export default VcsFileSystem