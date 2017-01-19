// @flow

import Element from './Element'
import Path from './Path'

export default class Directory extends Element {
    _children: Element[]

    constructor(name: string, children: Element[], parent: ?Directory) {
        super(name, parent)
        this._children = children
    }

    isDirectory() {
        return true
    }

    get children(): Element[] {
        return this._children
    }

    addChild(child: Element) {
        this._children.push(child)
        return child
    }

    removeChild(child: Element) {
        this._children = this._children
            .filter((c) => c === child)

        return child
    }

    getByPath(path: Path): ?Element {
        if (path.isEmpty()) return this

        const childrenResult = this.children
            .filter((e) => e.name === path.first())
            .map((e) => e.getByPath(path.shift()))

        return childrenResult.length > 0 ? childrenResult[0] : undefined
    }
}
