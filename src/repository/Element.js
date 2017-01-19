// @flow

import Repository from './Repository'
import Directory from './Directory'
import Path from './Path'

export default class Element {
    _name: string
    _parent: ?Directory

    constructor(name: string, parent: ?Directory) {
        this._name = name
        this._parent = parent
    }

    get name(): string {
        return this._name
    }

    set name(name: string) {
        this._name = name
        // if (Element.isValidName(name)) this._name = name
        // else throw 'Invalid Name'
    }

    // static isValidName(name: string) {
    //     return !!name && name.length > 0
    // }

    get parent(): ?Directory {
        return this._parent
    }

    set parent(value: Directory) {
        this._parent = value
    }

    get path(): string {
        if (!this._parent) return ''

        return `${this._parent.path}${Repository.FileSystemSeparator}${this._name}`
    }

    isDirectory(): boolean { throw new Error('Not implemented method') }

    getByPath(path: Path): ?Element {
        throw new Error('Not implemented method')
    }
}
