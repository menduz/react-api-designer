import {GlobalState} from "../repository/index";
import {AppState} from "../reducers/AppState";
import {Actions, AppAction} from './index'
import Dispatch = Redux.Dispatch;

import {Repository} from "../repository/immutable/Repository";
import {RepositoryFactory} from "../repository/immutable/RepositoryFactory";

export const init = (repositoy: Repository) => { return {type: Actions.INIT, repository: repositoy} };

export class InitAction implements AppAction {
    readonly type = Actions.INIT;
    readonly repository: Repository;
}

export const addFile = () => {
    return (dispatch: Dispatch<AppState>, getState: () => AppState) => {
        const appState = getState();

        const parentPath = appState.selectedElement && appState.selectedElement.isDirectory() ?
            appState.selectedElement.path : GlobalState.repository.root.path;

        GlobalState.repository.addFile(parentPath.toString(), 'pepe.raml', '#%RAML 1.0')
            .then((file) => { dispatch(fileAdded(RepositoryFactory.file(file))) })
    };
};

const fileAdded = (file: Repository.File): FileAdded => ({type: Actions.FILE_ADDED, file: file});

export class FileAdded implements AppAction {
    readonly type = Actions.FILE_ADDED;
    readonly file: Repository.File;
}