// @flow

import type {Path} from './FileSystem'
import MapFileSystem from './MapFileSystem'
import {MapHelper} from './MapFileSystem'
import type {MapEntry} from './MapFileSystem'

class MemoryMapHelper extends MapHelper {
  _map: Map<string, MapEntry>

  constructor(map: Map<string, MapEntry>) {
    super()
    this._map = map
  }

  forEach(fn: (entry: MapEntry) => void): void {
    Array.from(this._map.values()).forEach(fn)
  }

  has(path: Path): boolean {
    return this._map.has(path)
  }

  set(path: Path, content: MapEntry): void {
    this._map.set(path, content)
  }

  get(path: Path): ?MapEntry {
    return this._map.get(path)
  }

  remove(path: Path): void {
    this._map.delete(path)
  }
}

class MemoryFileSystem extends MapFileSystem {
  constructor(helper: MapHelper) {
    super(helper, 0)
  }

  static from(entries: MapEntry[]): MemoryFileSystem {
    const map = new Map(entries.map(e => [e.path, e]))
    return new MemoryFileSystem(new MemoryMapHelper(map))
  }

  static empty(): MemoryFileSystem {
    return new MemoryFileSystem(new MemoryMapHelper(new Map()))
  }
}

export default MemoryFileSystem