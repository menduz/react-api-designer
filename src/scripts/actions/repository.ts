import {GlobalState} from "../repository/index";
import {Actions, AppAction} from './index'
import Dispatch = Redux.Dispatch;

import {Repository} from "../repository/immutable/Repository";
import {RepositoryFactory} from "../repository/immutable/RepositoryFactory";
import {AppState, SelectedElementState} from "../reducers/index";

export const init = (repository: Repository) => { return {type: Actions.INIT, repository: repository} };

export class InitAction implements AppAction {
    readonly type = Actions.INIT;
    readonly repository: Repository;
}

export const addFile = () => {
    return (dispatch: Dispatch<AppState>, getState: () => AppState) => {
        const appState = getState();
        const selectedElement = appState.get(SelectedElementState) as Repository.Element;

        const parentPath = selectedElement && selectedElement.isDirectory() ?
            selectedElement.path : GlobalState.repository.root.path;

        GlobalState.repository.addFile(parentPath.toString(), 'pepe.raml', '#%RAML 1.0')
            .then((file) => { dispatch(fileAdded(RepositoryFactory.file(file))) })
    };
};

const fileAdded = (file: Repository.File): FileAdded => ({type: Actions.FILE_ADDED, file: file});

export class FileAdded implements AppAction {
    readonly type = Actions.FILE_ADDED;
    readonly file: Repository.File;
}