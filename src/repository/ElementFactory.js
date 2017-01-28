// @flow

import FileSystem, {EntryFile, EntryFolder} from './file-system/FileSystem'
import type {Entry} from './file-system/FileSystem'
import Directory from './Directory'
import Element from './Element'
import File from './File'

class ElementFactory {
  static element(fileSystem: FileSystem, entry: Entry, parent?: Directory): Element {
    switch (entry.type) {
      case EntryFolder:
        return ElementFactory.directory(fileSystem, entry, parent)
      case EntryFile:
        return ElementFactory.file(fileSystem, entry, parent)
      default:
        throw new Error(`${entry.type} is not a valid entry type.`)
    }
  }

  static directory(fileSystem: FileSystem, entry: Entry, parent?: Directory): Directory {
    if (entry.type !== EntryFolder) throw new Error('This isn\'t a folder entry')

    const EntryChildren = entry.children || []
    const children = EntryChildren.map((entry) => ElementFactory.element(fileSystem, entry))
    const directory = new Directory(entry.name, children, parent)
    children.forEach((child: Element) => {
      child.parent = directory
    })

    return directory
  }

  static file(fileSystem: FileSystem, entry: Entry, parent?: Directory): File {
    if (entry.type !== EntryFile) throw new Error('This isn\'t a file entry')

    return File.empty(entry.name, fileSystem, parent)
  }
}

export default ElementFactory