import {FileSystem, Entry, EntryFile, EntryFolder} from "../file-system/FileSystem";
import {List} from 'immutable';

export namespace MutableRepository {

    export class Repository {
        static FileSystemSeparator = '/';

        private _fileSystem: FileSystem;
        private _root: Repository.Directory;

        constructor(fileSystem: FileSystem, root: Repository.Directory) {
            this._fileSystem = fileSystem;
            this._root = root;
        }

        static fromFileSystem(fileSystem: FileSystem): Promise<Repository> {
            return fileSystem.directory(Repository.FileSystemSeparator)
                .then((entry: Entry) => new Repository(fileSystem, Repository.ElementFactory.directory(entry)));
        }

        get root() { return this._root; }

        getByPath(path: string): Repository.Element {
            var pathElements = path.split(Repository.FileSystemSeparator)
                .filter(s => s.length !== 0);

            return this.root.getByPath(List(pathElements));
        }

        saveFile(file: Repository.File): Promise<Repository.File> {
            return file.getContent()
                .then((content) => this._fileSystem.save(file.path, content))
                .then(() => file);
        }

        addFile(path: string, name: string, content: string): Promise<Repository.File> {
            const element = this.getByPath(path);
            if (!element.isDirectory()) return;
            const directory = element as Repository.Directory;
            const file = Repository.File.File(name, content, directory);

            return file.getContent()
                .then(content => this._fileSystem.save(file.path, content))
                .then(() => { directory.children.push(file) })
                .then(() => file);
        }

        addDirectory(path: string, name: string) {
            const element = this.getByPath(path);
            if (!element.isDirectory()) return;
            const directory = element as Repository.Directory;
            const newDirectory = new Repository.Directory(name, [], directory);
            directory.children.push(newDirectory);

            return newDirectory;
        }
    }

    export namespace Repository {
        export class ElementFactory {
            static element(entry: Entry, parent?: Directory): Element {
                switch (entry.type) {
                    case EntryFolder:
                        return ElementFactory.directory(entry, parent);
                    case EntryFile:
                        return ElementFactory.file(entry, parent);
                }
                throw `${entry.type} is not a valid entry type.`;
            }

            static directory(entry: Entry, parent?: Directory): Directory {
                if (entry.type !== EntryFolder) throw 'This isn\'t a folder entry';

                const children = entry.children.map((entry) => ElementFactory.element(entry));
                const directory = new Directory(entry.name, children, parent);
                children.forEach((child: Element) => { child.parent = directory; });

                return directory;
            }

            static file(entry: Entry, parent?: Directory): File {
                if (entry.type !== EntryFile) throw 'This isn\'t a file entry';

                return File.EmptyFile(entry.name, parent)
            }
        }

        export abstract class Element {
            protected _name: string;
            protected _parent?: Directory;

            constructor(name: string, parent?: Directory) {
                this._name = name;
                this._parent = parent;
            }

            get name() {
                return this._name
            }

            set name(name: string) {
                this._name = name;
                // if (Element.isValidName(name)) this._name = name;
                // else throw 'Invalid Name';
            }

            protected static isValidName(name: string) {
                return !!name && name.length > 0;
            }

            get parent(): Directory {
                return this._parent;
            }

            set parent(value: Directory) {
                this._parent = value;
            }

            get path(): string {
                if (!this._parent) return '';

                return `${this._parent.path}${Repository.FileSystemSeparator}${this._name}`
            }

            abstract isDirectory(): boolean;

            abstract getByPath(path: List<string>): Repository.Element;
        }

        export class Directory extends Element {
            private _children: Element[];

            constructor(name: string, children: Element[], parent?: Directory) {
                super(name, parent);
                this._children = children;
            }

            isDirectory() {
                return true;
            }

            get children() {
                return this._children;
            }

            addChild(child: Element) {
                this._children.push(child);
                return child;
            }

            removeChild(child: Element) {
                this._children = this._children
                    .filter((c) => c === child);

                return child;
            }

            getByPath(path: List<string>): Repository.Element {
                if (path.isEmpty()) return this;

                var childrenResult = this.children
                    .filter((e) => e.name === path.first())
                    .map((e) => e.getByPath(path.shift()));

                return childrenResult.length > 0 ? childrenResult[0] : undefined;
            }
        }

        export class File extends Element {
            protected _name: string;
            protected _parent?: Directory;
            private _state: File.State;

            private constructor(name: string, parent?: Directory) {
                super(name, parent);
                this._state = new File.EmptyState(this);
            }

            static EmptyFile(name: string, parent?: Directory) {
                return new File(name, parent);
            }

            static File(name: string, content: string, parent?: Directory) {
                var file = new File(name, parent);
                file.setContent(content);
                return file;
            }

            isDirectory() {
                return false;
            }

            getContent(): Promise<string> {
                const [content, newState] = this._state.getContent();
                this._state = newState;
                return content;
            }

            setContent(content: string): void {
                this._state = this._state.setContent(content);
            }

            get dirty(): boolean {
                const [dirty, newState] = this._state.dirty();
                this._state = newState;
                return dirty;
            }

            set state(value: File.State) {
                this._state = value;
            }

            getByPath(path: List<string>): Repository.Element {
                return path.isEmpty() ? this : undefined;
            }
        }

        export namespace File {

            export interface State {
                getContent(): [Promise<string>, State];
                setContent(content: string): State;
                dirty(): [boolean, State];
            }

            export class EmptyState implements State {
                private _file: File;

                constructor(file: File) {
                    this._file = file;
                }

                getContent(): [Promise<string>, State] {
                    const contentPromise: Promise<string> = new Promise<string>((resolve) => {
                        // Loads from repository...
                        setTimeout(() => {
                            resolve("");
                        }, 100);
                    });

                    return [contentPromise, new LoadingState(this._file, contentPromise)];
                }

                setContent(content: string): State {
                    return new DirtyState(content);
                }

                dirty(): [boolean, State] {
                    return [false, this]
                }
            }

            class LoadingState implements State {
                private _file: File;
                private _content: Promise<string>;

                constructor(file: File, content: Promise<string>) {
                    this._file = file;
                    this._content = content;

                    content.then((result) => {
                        this._file.state = new LoadedState(result);
                    });
                }

                getContent(): [Promise<string>, State] {
                    return [this._content, this];
                }

                setContent(content: string): State {
                    return new DirtyState(content);
                }

                dirty(): [boolean, State] {
                    return [false, this];
                }
            }

            class LoadedState implements State {
                _content: string;

                constructor(content: string) {
                    this._content = content;
                }

                getContent(): [Promise<string>, State] {
                    return [Promise.resolve(this._content), this];
                }

                setContent(content: string): State {
                    return new DirtyState(content);
                }

                dirty(): [boolean, State] {
                    return [false, this];
                }
            }

            class DirtyState implements State {
                _content: string;

                constructor(content: string) {
                    this._content = content;
                }

                getContent(): [Promise<string>, State] {
                    return [Promise.resolve(this._content), this];
                }

                setContent(content: string): State {
                    this._content = content;
                    return this;
                }

                dirty(): [boolean, State] {
                    return [true, this];
                }
            }
        }
    }
}