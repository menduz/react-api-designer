// @flow

import VcsRemoteApi from "../../vcs-api/VcsRemoteApi";
import {EntryMetadata, ContentData} from "../../vcs-api/VcsElements";

import FileSystem from './FileSystem'
import type {Path, Entry, FileData} from './FileSystem'

class VcsFileSystem extends FileSystem {
  _vcsApi: VcsRemoteApi

  constructor(vcsApi: VcsRemoteApi) {
    super()
    this._vcsApi = vcsApi
  }

  directory(path: Path): Promise<Entry> {
    return this._vcsApi.files()
      .then(EntryFactory.fromBasicMetadata)
  }

  save(entries: FileData[]): Promise<Entry> {
    const data = entries
      .map((entry) => new ContentData(entry.path, entry.content))
    return this._vcsApi.save(data)
      .then(EntryFactory.fromBasicMetadata)
  }

  createFolder(path: Path) {
    return Promise.resolve()
  }

  load(path: Path): Promise<string> {
    return this._vcsApi.file(path)
      .then(result => {
        if (result.status && result.status === 404) throw result.message
        return result
      })
  }

  remove(path: Path) {
    return this._vcsApi.deleteFile(path)
  }

  rename(source: Path, destination: Path, isDirectory: boolean) {
    if (isDirectory) return Promise.resolve()
    return this._vcsApi.moveFile(source, destination)
  }
}

class EntryFactory {
  static fromBasicMetadata(elements: EntryMetadata[]) {
    const children = EntryFactory.entriesInPath(elements, '', 0)
    return Entry.folder('', Entry.SEPARATOR, children)
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
    const path = Entry.SEPARATOR + metadata.path;
    const children = EntryFactory.entriesInPath(deeperItems, metadata.path, metadata.pathLength());

    return Entry.folder(name, path, children)
  }

  static fileEntry(metadata: EntryMetadata): Entry {
    const name = metadata.name();
    const path = Entry.SEPARATOR + metadata.path;

    return Entry.file(name, path)
  }
}

export default VcsFileSystem