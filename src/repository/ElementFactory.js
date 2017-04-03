// @flow

import {FileSystem, EntryTypes} from './file-system/FileSystem'
import type {Entry} from './file-system/FileSystem'
import {Element, File, Directory} from './Element'

class ElementFactory {
  static element(fileSystem: FileSystem, entry: Entry, parent: Directory): Element {
    switch (entry.type) {
      case EntryTypes.Folder:
        return ElementFactory.directory(fileSystem, entry, parent)
      case EntryTypes.File:
        return ElementFactory.file(fileSystem, entry, parent)
      default:
        throw new Error(`${entry.type} is not a valid entry type.`)
    }
  }

  static directory(fileSystem: FileSystem, entry: Entry, parent?: Directory): Directory {
    if (entry.type !== EntryTypes.Folder) throw new Error('This isn\'t a folder entry')

    const entryChildren = entry.children || []
    const childProvider = (parent: Directory) =>
      entryChildren.map((entry) => ElementFactory.element(fileSystem, entry, parent))
    return new Directory(entry.name, childProvider, parent)
  }

  static file(fileSystem: FileSystem, entry: Entry, parent: Directory): File {
    if (entry.type !== EntryTypes.File) throw new Error('This isn\'t a file entry')

    return File.persistedFile(entry.name, fileSystem, parent)
  }
}

export default ElementFactory