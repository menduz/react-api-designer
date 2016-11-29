import {Map} from 'immutable';

import {Repository} from '../repository/immutable/Repository'

export class AppState {
    private readonly _repository: Repository;
    private readonly _selectedElement: Repository.Element | undefined;
    private readonly _files: Map<string, Repository.File>;
    private readonly _expandedDirs: Map<string, boolean>;

    private constructor(_repository: Repository,
                _selectedElement: Repository.Element,
                _files: Map<string, Repository.File>,
                _expandedDirs: Map<string, boolean>) {
        this._repository = _repository;
        this._selectedElement = _selectedElement;
        this._files = _files;
        this._expandedDirs = _expandedDirs;
    }

    static empty() {
        return new AppState(Repository.empty(),
            undefined,
            Map<string, Repository.File>(),
            Map<string, boolean>()
        )
    }

    get repository(): Repository { return this._repository; }

    get selectedElement(): Repository.Element { return this._selectedElement; }

    get files(): Map<string, Repository.File> { return this._files; }

    get expandedDirs(): Map<string, boolean> { return this._expandedDirs; }

    withRepository(repository: Repository) {
        return new AppState(repository, this._selectedElement, this._files, this._expandedDirs);
    }

    withSelectedElement(element: Repository.Element) {
        return new AppState(this._repository, element, this._files, this._expandedDirs);
    }

    withFiles(files: Map<string, Repository.File>) {
        return new AppState(this._repository, this._selectedElement, files, this._expandedDirs);
    }

    withExpandedDirs(expandedDirs: Map<string, boolean>) {
        return new AppState(this._repository, this._selectedElement, this._files, expandedDirs);
    }
}
