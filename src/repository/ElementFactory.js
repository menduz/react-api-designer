// @flow

import FileSystem from './file-system/FileSystem'
import type {Entry} from './file-system/FileSystem'
import {Element, File, Directory} from './Element'

class ElementFactory {
  static element(fileSystem: FileSystem, entry: Entry, parent?: Directory): Element {
    switch (entry.type) {
      case FileSystem.FolderEntryType:
        return ElementFactory.directory(fileSystem, entry, parent)
      case FileSystem.FileEntryType:
        return ElementFactory.file(fileSystem, entry, parent)
      default:
        throw new Error(`${entry.type} is not a valid entry type.`)
    }
  }

  static directory(fileSystem: FileSystem, entry: Entry, parent?: Directory): Directory {
    if (entry.type !== FileSystem.FolderEntryType) throw new Error('This isn\'t a folder entry')

    const entryChildren = entry.children || []
    const children = entryChildren.map((entry) => ElementFactory.element(fileSystem, entry))
    const directory = new Directory(entry.name, children, parent)
    children.forEach((child: Element) => {
      child.parent = directory
    })

    return directory
  }

  static file(fileSystem: FileSystem, entry: Entry, parent?: Directory): File {
    if (entry.type !== FileSystem.FileEntryType) throw new Error('This isn\'t a file entry')

    return File.persistedFile(entry.name, fileSystem, parent)
  }
}

export default ElementFactory