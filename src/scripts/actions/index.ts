import {Action} from "redux";
import {Path} from "../repository/Path";

export enum Actions{
    CONTENT_CHANGED,
    INIT,
    ELEMENT_SELECTED,
    FILE_ADDED,
    DIRECTORY_ADDED,
    SAVE_FILE,
    FILE_LOADED,
    FILE_SAVED
}

export interface AppAction extends Action {
    type: Actions;
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