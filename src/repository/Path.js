// @flow

import {List} from  'immutable'

export default class Path {
  static FileSystemSeparator = '/'
  static BackSymbol = '..'

  toString(): string { throw new Error('Not implemented method') }
  isEmpty(): boolean { throw new Error('Not implemented method') }
  isAbsolute(): boolean { throw new Error('Not implemented method') }
  parent(): Path { throw new Error('Not implemented method') }
  shift(): Path { throw new Error('Not implemented method') }
  first(): string { throw new Error('Not implemented method') }
  last(): string { throw new Error('Not implemented method') }

  elements(): List<string> { throw new Error('Not implemented method') }

  append(element: string): Path {
    return Path.path(this.elements().push(element), this.isAbsolute())
  }

  equalsTo(other: ?Path): boolean {
    return !!other && this.toString() === other.toString()
  }

  isDescendantOf(other: Path): boolean {
    return this.toString().startsWith(other.toString())
  }

  relativePathTo(other: Path): Path {
    if (this.isAbsolute() !== other.isAbsolute()) return other

    const [thisDiff, otherDiff] = this.diff(other)
    const resultElements = thisDiff
      .elements()
      .map(() => Path.BackSymbol)
      .concat(otherDiff.elements())

    return Path.path(resultElements, false)
  }


  diff(other: Path): [Path, Path] {
    if (this.isAbsolute() !== other.isAbsolute()) return [this, other]
    if (this.isEmpty() && other.isEmpty()) return [this, other]
    if (this.first() !== other.first()) return [this, other]

    return this.shift().diff(other.shift())
  }

  static emptyPath = (absolute: boolean = true): Path => {
    // eslint-disable-next-line
    return absolute ? new AbsoluteEmptyPath() : new RelativeEmptyPath()
  }

  static mergePath(basePath: Path, relativePath: Path): Path {
    if (relativePath.isAbsolute()) return relativePath

    return relativePath.elements().reduce(
      (result: Path, value: string) =>
        value === Path.BackSymbol ? result.parent() : result.append(value),
      basePath
    )
  }

  static path = (elements: List<string>, absolute: boolean = true): Path => {
    const filteredElements = elements.filter((s) => s && s.length > 0).toList()

    if (filteredElements.isEmpty()) return Path.emptyPath(absolute)
    // eslint-disable-next-line
    return absolute ? new AbsolutePathImpl(filteredElements) : new RelativePathImpl(filteredElements)
  }

  static fromString = (value: string): Path => {
    const absolute = value.indexOf(Path.FileSystemSeparator) === 0

    return Path.path(List(value.split(Path.FileSystemSeparator)), absolute)
  }
}

class EmptyPath extends Path {

  isEmpty(): boolean { return true }

  parent(): Path { return this }

  shift(): Path { return this }

  first(): string { return '' }

  last(): string { return '' }

  elements(): List<string> { return List() }
}

class AbsoluteEmptyPath extends EmptyPath {

  isAbsolute(): boolean { return true }

  toString(): string { return Path.FileSystemSeparator }
}

class RelativeEmptyPath extends EmptyPath {

  isAbsolute(): boolean { return false }

  toString(): string { return '' }
}

class PathImpl extends Path {

  _elements: List<string>

  constructor(elements: List<string>) {
    super()
    this._elements = elements
  }

  isEmpty(): boolean { return false }

  parent(): Path { return Path.path(this._elements.pop()) }

  shift(): Path { return Path.path(this._elements.shift(), false) }

  first(): string { return this._elements.first() }

  last(): string { return this._elements.last() }

  elements(): List<string> { return this._elements }
}

class AbsolutePathImpl extends PathImpl {

  isAbsolute(): boolean { return true }

  toString(): string { return Path.FileSystemSeparator + this._elements.join(Path.FileSystemSeparator) }
}

class RelativePathImpl extends PathImpl {

  isAbsolute(): boolean { return false }

  toString(): string { return this._elements.join(Path.FileSystemSeparator) }
}
