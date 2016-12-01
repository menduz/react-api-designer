import {Map} from 'immutable';
import {AppAction, Actions, SaveFile} from "../actions/index";
import {FileAdded, InitAction, DirectoryAdded, SelectElement, FileLoaded} from "../actions/repository";
import {Path} from "../repository/Path";
import {Repository} from "../repository/immutable/Repository";

export const RepositoryState = 'RepositoryState';
export const SelectedElementState = 'SelectedElementState';
export const ExpandedDirectoriesState = 'ExpandedDirectoriesState';
export const FilesState = 'FilesState';

export type AppState = Map<string, any>;

const addDirectoryReducer = function (state: Map<string, any>, addDirectoryAction: DirectoryAdded) {
    const repository = state.get(RepositoryState, Repository.empty()) as Repository;
    return state.set(RepositoryState, repository.updateElement(addDirectoryAction.directory));
};

const addFileReducer = function (state: AppState, addFileAction: FileAdded) {
    const repository = state.get(RepositoryState, Repository.empty()) as Repository;
    return state.set(RepositoryState, repository.updateElement(addFileAction.file));
};

const selectElementReducer = function (state: AppState, selectAction: SelectElement) {
    const repository = state.get(RepositoryState, Repository.empty()) as Repository;

    const element = repository.getByPath(selectAction.path);
    const selectedState = state.set(SelectedElementState, element);

    const toggleDir = function (expandedDirs: Map<string, boolean>, path: string) {
        const expanded = expandedDirs.get(path, false);
        return expandedDirs.set(path, !expanded);
    };

    const expandedDirs = state.get(ExpandedDirectoriesState, Map<string, boolean>()) as Map<string, boolean>;
    const newExpanded = element.isDirectory()? toggleDir(expandedDirs, element.path.toString()): expandedDirs;
    return selectedState.set(ExpandedDirectoriesState, newExpanded);
};

const fileLoadedReducer = function (state: AppState, fileLoaded: FileLoaded) {
    const contents = state.get(FilesState, Map<string, string>());
    return state.set(FilesState, contents.set(fileLoaded.path, fileLoaded.content))
};

const initReducer = function (state: AppState, action: InitAction) {
    return state.set(RepositoryState, action.repository);
};

const saveFileReducer = function (state: AppState, action: SaveFile) {
    const selectedElement = state.get(SelectedElementState);
    if(!selectedElement) return state;

};

export const apiDesignerReducer = (state: AppState, action: AppAction): AppState => {
    state = state || Map<string, boolean>();

    console.log("// ======= Action ======= ");
    console.log(action);

    switch (action.type) {
        case Actions.INIT:
            return initReducer(state, action as InitAction);
        case Actions.ELEMENT_SELECTED:
            return selectElementReducer(state, action as SelectElement);
        case Actions.FILE_ADDED:
            return addFileReducer(state, action as FileAdded);
        case Actions.DIRECTORY_ADDED:
            return addDirectoryReducer(state, action as DirectoryAdded);
        case Actions.FILE_LOADED:
        case Actions.CONTENT_CHANGED:
            return fileLoadedReducer(state, action as FileLoaded);
        default:
            return state;
    }
};