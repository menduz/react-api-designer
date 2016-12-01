import {GlobalState} from "../repository/index";
import {Actions, AppAction} from './index'
import Dispatch = Redux.Dispatch;
import {Map} from 'immutable';
import {Repository} from "../repository/immutable/Repository";
import {RepositoryFactory} from "../repository/immutable/RepositoryFactory";
import {AppState, SelectedElementState, RepositoryState, FilesState} from "../reducers/index";
import {Path} from "../repository/Path";
import {MutableRepository} from "../repository/mutable/Repository";

export const init = (repository: Repository) => { return {type: Actions.INIT, repository: repository} };

export class InitAction implements AppAction {
    readonly type = Actions.INIT;
    readonly repository: Repository;
}

export const addFile = () => {
    return (dispatch: Dispatch<AppState>, getState: () => AppState) => {
        const appState = getState();
        const parentPath = getSelectedDirectoryOrRootPath(appState);

        GlobalState.repository.addFile(parentPath.toString(), 'pepe.raml', '#%RAML 1.0')
            .then((file) => { dispatch(fileAdded(RepositoryFactory.file(file))) })
    };
};

const fileAdded = (file: Repository.File): FileAdded => ({type: Actions.FILE_ADDED, file: file});

export class FileAdded implements AppAction {
    readonly type = Actions.FILE_ADDED;
    readonly file: Repository.File;
}

const getSelectedDirectoryOrRootPath = (appState: AppState): Path => {
    const selectedElement = appState.get(SelectedElementState) as Repository.Element;

    return selectedElement && selectedElement.isDirectory() ?
        selectedElement.path : Path.fromString(GlobalState.repository.root.path);
};

export const addDirectory = () => {
    return (dispatch: Dispatch<AppState>, getState: () => AppState) => {
        const appState = getState();
        const parentPath = getSelectedDirectoryOrRootPath(appState);

        GlobalState.repository.addDirectory(parentPath.toString(), 'myFolder')
            .then((directory) => { dispatch(directoryAdded(RepositoryFactory.directory(directory))) })
    };
};

const directoryAdded = (directory: Repository.Directory): DirectoryAdded =>
    ({type: Actions.DIRECTORY_ADDED, directory: directory});

export class DirectoryAdded implements AppAction {
    readonly type = Actions.DIRECTORY_ADDED;
    readonly directory: Repository.Directory;
}

export const selectElement = (path: Path) => {
    return (dispatch: Dispatch<AppState>, getState: () => AppState) => {
        dispatch({type: Actions.ELEMENT_SELECTED, path: path});

        const repository = getState().get(RepositoryState) as Repository;
        const element = repository.getByPath(path);
        if (!element.isDirectory()) {
            const contents = getState().get(FilesState, Map<string, string>()) as Map<string, string>;
            const content = contents.get(path.toString());
            if (content === undefined) {
                const file = GlobalState.repository.getByPath(path.toString()) as MutableRepository.Repository.File;
                file.getContent().then((content) => dispatch(fileLoaded(file.path, content)))
            }
        }
    }
};

const fileLoaded = (path: string, content: string): FileLoaded =>
    ({type: Actions.FILE_LOADED, path: path, content: content});

export class FileLoaded implements AppAction {
    readonly type = Actions.FILE_LOADED;
    readonly path: string;
    readonly content: string;
}

export class SelectElement implements AppAction {
    readonly type = Actions.ELEMENT_SELECTED;
    readonly path: Path;
}

export const contentChanged = (path: Path, content: string) => {
    return (dispatch: Dispatch<AppState>, getState: () => AppState) => {
        const element = GlobalState.repository.getByPath(path.toString());
        if (!element.isDirectory()){
            const file = element as MutableRepository.Repository.File;
            file.setContent(content);
            dispatch({type: Actions.CONTENT_CHANGED, path: path.toString(), content: content});
        }
    }
};

export class ContentChanged implements AppAction {
    readonly type = Actions.CONTENT_CHANGED;
    readonly path: string;
    readonly content: string;
}

