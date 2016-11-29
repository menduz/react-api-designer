import {Action} from "redux";

export enum Actions{
    INIT,
    SELECT_ELEMENT,
    FILE_ADDED,
    ADD_DIRECTORY,
    SAVE_FILE,
    FILE_SAVED
}

export interface AppAction extends Action {
    type: Actions;
}

export class SelectElement implements AppAction {
    readonly type = Actions.SELECT_ELEMENT;
    readonly path: string;
}

export class AddDirectory implements AppAction {
    readonly type = Actions.ADD_DIRECTORY;
    readonly name: string;
}

export const saveFile = function(): SaveFile { return { type: Actions.SAVE_FILE,} };

export class SaveFile implements AppAction { readonly type = Actions.SAVE_FILE; }

export const fileSaved = function(path: string): FileSaved {
    return {
        type: Actions.SAVE_FILE,
        path: path
    }
};

export class FileSaved implements AppAction {
    readonly type = Actions.SAVE_FILE;
    readonly path: string;
}