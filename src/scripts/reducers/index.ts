import {Map} from 'immutable';
import {AppState} from "./AppState";
import {ImmutableRepository} from '../repository/ImmutableRepository';
import {AppAction, Actions, SelectElement, AddDirectory, SaveFile} from "../actions/index";
import fromMutableFileRepository = ImmutableRepository.Repository.fromMutableFileRepository;
import {FileAdded, InitAction} from "../actions/repository";
import {Path} from "../repository/Path";

const addDirectoryReducer = function (state: AppState, addDirectoryAction: AddDirectory) {
    // const path = state.selectedElement && state.selectedElement.isDirectory() ? state.selectedElement.path : state.repository.root.path;
    // GlobalState.repository.addDirectory(path, addDirectoryAction.name);
    // return state
    //     .withRepository(fromMutableFileRepository(GlobalState.repository));
    return state;
};

const addFileReducer = function (state: AppState, addFileAction: FileAdded) {
    return state.withRepository(state.repository.updateElement(addFileAction.file));
};

const selectElementReducer = function (state: AppState, selectAction: SelectElement) {
    const element = state.repository.getByPath(Path.fromString(selectAction.path));
    const selectedState = state.withSelectedElement(element);

    var toggleDir = function (expandedDirs: Map<string, boolean>, path: string) {
        const expanded = expandedDirs.get(path, false);
        return expandedDirs.set(path, !expanded);
    };

    return element.isDirectory() ? selectedState.withExpandedDirs(toggleDir(state.expandedDirs, element.path.toString())) : selectedState;
};

const initReducer = function (state: AppState, action: InitAction) { return state.withRepository(action.repository); };

const saveFileReducer = function (state: AppState, action: SaveFile) {
    const selectedElement = state.selectedElement;
    if(!selectedElement) return state;

};

export const apiDesignerReducer = (state: AppState, action: AppAction): AppState => {
    state = state || AppState.empty();

    console.log("// ======= Action ======= ");
    console.log(action);

    switch (action.type) {
        case Actions.INIT:
            return initReducer(state, action as InitAction);
        case Actions.SELECT_ELEMENT:
            return selectElementReducer(state, action as SelectElement);
        case Actions.FILE_ADDED:
            return addFileReducer(state, action as FileAdded);
        case Actions.ADD_DIRECTORY:
            return addDirectoryReducer(state, action as AddDirectory);
        default:
            return state;
    }
};