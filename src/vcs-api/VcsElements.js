export class PathMetadata {

  path: string

  constructor(path: string) {
    this.path = path
  }

  parentPath(): string {
    return this.pathMembers()
      .slice(-1)
      .join(EntryMetadata.SEPARATOR)
  }

  pathMembers(): string[] {
    return this.path
      .split(EntryMetadata.SEPARATOR)
  }

  pathLength(): Number {
    return this.pathMembers().length
  }

  name(): string {
    const pathElements = this.pathMembers()
    return pathElements[pathElements.length - 1]
  }
}

export class EntryMetadata extends PathMetadata {

  type: EntryMetadata.FILE | EntryMetadata.FOLDER

  constructor(path: string, type: EntryMetadata.FILE | EntryMetadata.FOLDER) {
    super(path)
    this.type = type
  }

  static fromObject(object: {path: string, type: EntryMetadata.FILE | EntryMetadata.FOLDER}) {
    return new EntryMetadata(object.path, object.type)
  }

  static file(path: string) {
    return new EntryMetadata(path, EntryMetadata.FILE)
  }

  static folder(path: string) {
    return new EntryMetadata(path, EntryMetadata.FOLDER)
  }
}

export class ContentData extends EntryMetadata {
  content: string

  constructor(path: string, content: string) {
    super(path, EntryMetadata.FILE)
    this.content = content
  }
}

EntryMetadata.FILE = 'FILE'
EntryMetadata.FOLDER = 'FOLDER'
EntryMetadata.SEPARATOR = '/'
