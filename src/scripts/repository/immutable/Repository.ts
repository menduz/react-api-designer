import {List} from 'immutable';
import {Set} from 'immutable';
import {Map} from 'immutable';

import {Path} from './../Path';

export class Repository {
    private readonly _root: Repository.Directory;

    constructor(root: Repository.Directory) {
        this._root = root;
    }

    get root(): Repository.Directory { return this._root; }

    static empty(): Repository {
        return new Repository(Repository.Directory.directory('', Path.emptyPath(), List<Repository.Element>()));
    }

    getByPath(path: Path): Repository.Element | null {
        return this._root.getByPath(path);
    }

    renameFile(file: Repository.File, name: string): Repository {
        return this.updateElement(file.withName(name));
    }

    moveElement(from: Path, to: Path): Repository {
        const element  = this.getByPath(from);

        return this
            .removeElement(from)
            .updateElement(element.withPath(to));
    }

    updateElement(element: Repository.Element): Repository {
        return new Repository(this._root.updateElement(element.path.parent(), element));
    }

    removeElement(path: Path): Repository {
        return new Repository(this._root.removeElement(path.parent(), path.last()));
    }
}

export namespace Repository {
    export abstract class Element {
        protected readonly _name: string;
        protected readonly _path: Path;

        constructor(name: string, path: Path) {
            this._name = name;
            this._path = path;
        }

        get name(): string { return this._name }

        get path(): Path { return this._path }

        protected static isValidName(name: string) {
            return !!name && name.length > 0;
        }

        abstract withPath(path: Path): Directory | Element;

        abstract isDirectory(): boolean;

        abstract getByPath(path: Path): Element | null;
    }

    export class Directory extends Element {
        private readonly _children: Map<string, Element>;

        private constructor(name: string, path: Path, children: Map<string, Element>) {
            super(name, path);
            this._children = children;
        }

        static directory(name: string, path: Path, children: List<Element>) {
            const childrenMap = Map<string, Element>(children.map(c => [c.name, c]));
            return new Directory(name, path, childrenMap);
        }

        isDirectory() { return true; }

        get children() { return List(this._children.values()); }

        withChildren(children: Map<string, Element>): Directory {
            return new Directory(this.name, this.path, children);
        }

        withChild<T extends Element>(child: T): Directory {
            return this.withChildren(this._children.set(child.name, child));
        }

        withPath(path: Path): Directory { return new Directory(this._name, path, this._children); }

        getByPath(path: Path): Element | null {
            if (path.isEmpty()) return this;

            const child = this._children.get(path.first());
            return child ? child.getByPath(path.shift()) : null;
        }

        updateElement(parentPath: Path, element: Element): Directory {
            if(parentPath.isEmpty()) return this.withChild(element);

            const child = this._children.get(parentPath.first());
            if (!child || !child.isDirectory()) throw `'${parentPath}' is not a valid path.`;

            const directoryChild = (child as Directory);
            return this.withChild(directoryChild.updateElement(parentPath.shift(), element));
        }

        removeElement(parentPath: Path, name: string): Directory {
            if(parentPath.isEmpty()) return this.withChildren(this._children.remove(name));

            const child = this._children.get(parentPath.first());
            if (!child || !child.isDirectory()) throw `'${parentPath}' is not a valid directory.`;

            const directoryChild = (child as Directory);
            return this.withChild(directoryChild.removeElement(parentPath.shift(), name));
        }
    }

    export class File extends Element {
        readonly _dirty: boolean;

        constructor(_name: string, _path: Path, _dirty: boolean) {
            super(_name, _path);
            this._dirty = _dirty;
        }

        isDirectory() { return false; }

        get dirty(): boolean { return this._dirty; }

        getByPath(path: Path): Element | null {
            return path.isEmpty() ? this : null;
        }

        withName(name: string) { return new File(name, this._path, this._dirty); }

        withPath(path: Path): File { return new File(this._name, path, this._dirty); }
    }
}
