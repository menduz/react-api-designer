import * as Immutable from 'immutable';
import List = Immutable.List;

import { MutableRepository } from './mutable/Repository';

export namespace ImmutableRepository {
    import MutableFileRepository = MutableRepository.Repository;
    import MutableElement = MutableRepository.Repository.Element;
    import MutableDirectory = MutableRepository.Repository.Directory;
    import MutableFile = MutableRepository.Repository.File;

    export class Repository {
        private readonly _root: Repository.Directory;
        private readonly _pathSeparator: string;

        constructor(root: Repository.Directory, pathSeparator: string) {
            this._root = root;
            this._pathSeparator = pathSeparator;
        }

        get root(): Repository.Directory { return this._root; }

        static fromMutableFileRepository(repository: MutableFileRepository) {
            return ImmutableConverter.fileRepository(repository);
        }

        static empty() {
            return new Repository(new Repository.Directory('', '/', List<Repository.Element>()),
                MutableRepository.Repository.FileSystemSeparator)
        }

        getByPath(path: string): Repository.Element {
            const pathElements = path.split(this._pathSeparator)
                .filter(s => s.length !== 0);

            return this._root.getByPath(List(pathElements));
        }
    }

    class ImmutableConverter {
        static fileRepository(mutableRepository: MutableFileRepository) {
            return new Repository(ImmutableConverter.directory(mutableRepository.root),
                MutableRepository.Repository.FileSystemSeparator);
        }

        static directory(mutableDirectory: MutableDirectory) {
            const children = List.of(... mutableDirectory.children)
                .map((element) => ImmutableConverter.element(element))
                .toList();

            return new Repository.Directory(mutableDirectory.name,
                mutableDirectory.path,
                children)
        }

        private static element(element: MutableElement): Repository.Element {
            if (element.isDirectory()) return ImmutableConverter.directory(element as MutableDirectory);

            return ImmutableConverter.file(element as MutableFile);
        }

        private static file(file: MutableFile) {
            return new Repository.File(file.name, file.path, file.dirty);
        }
    }

    export namespace Repository {

        export abstract class Element {
            protected readonly _name: string;
            protected readonly _path: string;

            constructor(name: string, path: string) {
                this._name = name;
                // if (Element.isValidName(name)) this._name = name;
                // else throw 'Invalid Name';

                this._path = path;
            }

            get name(): string { return this._name }

            get path(): string { return this._path }

            protected static isValidName(name: string) {
                return !!name && name.length > 0;
            }

            abstract isDirectory(): boolean;

            abstract getByPath(pathElements: List<string>): Element;
        }

        export class Directory extends Element {
            private readonly _children: List<Element>;

            constructor(name: string, path: string, children: List<Element>) {
                super(name, path);
                this._children = children;
            }

            isDirectory() { return true; }

            get children() { return this._children; }

            getByPath(pathElements: List<string>): Element {
                if (pathElements.isEmpty()) return this;

                return this.children
                    .filter((e) => e.name === pathElements.first())
                    .take(1)
                    .map((e) => e.getByPath(pathElements.shift()))
                    .first();
            }
        }

        export class File extends Element {
            readonly _dirty: boolean;

            constructor(_name: string, _path: string, _dirty: boolean) {
                super(_name, _path);
                this._dirty = _dirty;
            }

            isDirectory() { return false; }

            get name(): string { return this._name; }

            get path(): string { return this._path; }

            get dirty(): boolean { return this._dirty; }

            getByPath(pathElements: List<string>): Element {
                if (pathElements.isEmpty()) return this;

                return undefined;
            }
        }
    }
}