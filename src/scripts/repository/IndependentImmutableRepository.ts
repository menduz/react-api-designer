import * as Immutable from 'immutable';
import List = Immutable.List;
import {FileSystem, Entry, EntryFolder, EntryFile} from "./file-system/FileSystem";


namespace IndependentImmutableFileRepository {
    import Directory = FileRepository.Directory;
    import ElementFactory = FileRepository.ElementFactory;
    class FileRepository {
        static FileSystemSeparator = '/';

        private readonly _fileSystem: FileSystem;
        private readonly _root: Directory;

        private constructor(fileSystem: FileSystem, root: Directory) {
            this._fileSystem = fileSystem;
            this._root = root;
        }

        static FileRespository(fileSystem: FileSystem): Promise<FileRepository> {
            return fileSystem.directory(FileRepository.FileSystemSeparator)
                .then((entry) => new FileRepository(fileSystem, ElementFactory.directory(entry)));
        }

        renameFile(file: FileRepository.File, name: string): Promise<FileRepository> {
            return this._fileSystem.rename(file.path, file.path)

        }

        addFile(parent: Directory, file: FileRepository.File): Promise<FileRepository> {
            return

        }
    }

    namespace FileRepository {
        export class PathHelper {
            private constructor() {}

            static rename(oldPath: string, name: string): string {
                return oldPath.substring(oldPath.lastIndexOf(FileRepository.FileSystemSeparator) + 1) + name;
            }
        }

        export class ElementFactory {
            static element(entry: Entry): Element<any> {
                switch (entry.type) {
                    case EntryFolder: return ElementFactory.directory(entry);
                    case EntryFile: return ElementFactory.file(entry);
                }
                throw `${entry.type} is not a valid entry type.`;
            }

            static directory(entry: Entry): Directory {
                if (entry.type !== EntryFolder) throw 'This isn\'t a folder entry';

                const children = List.of<Entry>(... (entry.children))
                    .map((entry: Entry) => ElementFactory.element(entry))
                    .toList();

                return new Directory(entry.name, entry.path, children);
            }

            static root(entries: Entry[]): Directory {
                const children = List.of<Entry>(... entries)
                    .map((entry: Entry) => ElementFactory.element(entry))
                    .toList();

                return new Directory(FileRepository.FileSystemSeparator, FileRepository.FileSystemSeparator , children);
            }

            static file(entry: Entry): File {
                if (entry.type !== EntryFile) throw 'This isn\'t a file entry';

                return File.emptyFromDatabase(entry.name, entry.path)
            }
        }

        abstract class Element<T extends Element<T>> {
            protected readonly _name: string;
            protected readonly _path: string;

            constructor(name: string, path: string) {
                if (Element.isValidName(name)) this._name = name;
                else throw 'Invalid Name';

                this._path = path;
            }

            get name(): string { return this._name }

            get path(): string { return this._path }

            abstract withName(name: string): T;

            abstract withPath(path: string): T;

            protected static isValidName(name: string) {
                return !!name && name.length > 0;
            }


            abstract isDirectory(): boolean;
        }

        export class Directory extends Element<Directory> {
            private readonly _children: List<Element<any>>;

            constructor(name: string, path: string, children: List<Element<any>>) {
                super(name, path);
                this._children = children;
            }

            isDirectory() { return true; }

            get children() { return this._children; }

            get directoryChildren(): List<Directory> {
                return this._children.filter((c) => c.isDirectory()).toList() as List<Directory>;
            }

            get fileChildren(): List<File> {
                return this._children.filter((c) => !c.isDirectory()).toList() as List<File>;
            }

            withName(name: string): Directory {
                return new Directory(name, this._path, this._children);
            }

            withPath(path: string): Directory {
                return new Directory(this._name, path, this._children);
            }


            withChildren(children: List<Element<any>>): Directory {
                return new Directory(this._name, this._path, children);
            }

            addChild(child: Element<any>): Directory {
                return new Directory(this._name, this._path, this._children.push(child));
            }

            removeChild(child: Element<any>): Directory {
                const children = this._children
                    .filter((c) => c !== child)
                    .toList();

                return new Directory(this._name, this._path, children);
            }

            renameFile(file: File, name: string): Directory {
                if(this._children.contains(file))
                    return this
                        .removeChild(file)
                        .addChild(file.withName(name));

                const children = this.directoryChildren
                    .map((directory) => directory.renameFile(file, name))
                    .concat(this.fileChildren)
                    .toList();

                return this.withChildren(children);
            }
        }

        export class File extends Element<File> {
            readonly _dirty: boolean;
            readonly _loaded: boolean;
            readonly _content?: string;

            private constructor(_name: string, _path: string, _dirty: boolean, _loaded: boolean, content?: string) {
                super(_name, _path);
                this._dirty = _dirty;
                this._loaded = _loaded;
                this._content = content;
            }

            static emptyFromDatabase(name: string, path: string): File {
                return new File(name, path, false, false)
            }

            static withContentFromDatabase(name: string, path: string, content: string): File {
                return new File(name, path, false, true, content)
            }

            static withContent(name: string, path: string, content: string): File {
                return new File(name, path, true, true, content)
            }

            withContentFromDatabase(content: string) {
                return File.withContentFromDatabase(this._name, this._path, content);
            }

            withContent(content: string) {
                return File.withContent(this._name, this._path, content);
            }

            withName(name: string): File {
                return new File(name, this._path, this._dirty, this._loaded, this.content);
            }

            withPath(path: string): File {
                return new File(this._name, path, this._dirty, this._loaded, this.content);
            }

            isDirectory() { return false; }

            get content() { return this._content; }

            get name(): string { return this._name; }

            get path(): string { return this._path; }

            get dirty(): boolean { return this._dirty; }

            get loaded(): boolean { return this._loaded; }
        }
    }
}