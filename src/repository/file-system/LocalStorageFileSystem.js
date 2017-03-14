// @flow

import type {Path} from './FileSystem'
import MapFileSystem from './MapFileSystem'
import {MapHelper} from './MapFileSystem'
import type {MapEntry} from './MapFileSystem'

const LOCAL_PERSISTENCE_KEY = 'localStorageFilePersistence'

class LocalStorageHelper extends MapHelper {
  constructor(){ super() }

  forEach(fn: (entry: MapEntry) => void): void {
    for (let key: string in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        // A key is a local storage file system entry if it starts
        //with LOCAL_PERSISTENCE_KEY + '.'
        if (key.indexOf(LOCAL_PERSISTENCE_KEY + '.') === 0) {
          let item = localStorage.getItem(key)
          if (item) fn(JSON.parse(item))
        }
      }
    }
  }

  has(path: Path): boolean {
    let has = false
    path = path || '/'
    this.forEach((entry) => {
      if (entry.path.toLowerCase() === path.toLowerCase()) {
        has = true
      }
    })
    return has
  }

  set(path: Path, content: MapEntry): void {
    localStorage.setItem(
      LOCAL_PERSISTENCE_KEY + '.' + path,
      JSON.stringify(content)
    )
  }

  get(path: Path): ?MapEntry {
    let item = localStorage.getItem(LOCAL_PERSISTENCE_KEY + '.' + path)
    if (item) return (JSON.parse(item): MapEntry)
  }

  remove(path: Path): void {
    localStorage.removeItem(LOCAL_PERSISTENCE_KEY + '.' + path)
  }
}

class LocalStorageFileSystem extends MapFileSystem {
  constructor() {
    super(new LocalStorageHelper(), 500)
  }
}

export default LocalStorageFileSystem