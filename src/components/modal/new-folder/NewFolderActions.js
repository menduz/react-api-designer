// @flow

import {Path} from '../../../repository'

export const CHANGE_NAME = 'DESIGNER/NEWFOLDER/CHANGE_NAME';
export const CLEAR = 'DESIGNER/NEWFOLDER/CLEAR';
export const SHOW = 'DESIGNER/NEWFOLDER/SHOW_DIALOG';
export const HIDE = 'DESIGNER/NEWFOLDER/HIDE_DIALOG';

export const changeName = (name: string) => ({
  type: CHANGE_NAME,
  payload: name
});

export const openNewFolderDialog = (path: ?Path) => ({
  type: SHOW,
  payload: path
})

export const closeNewFolderDialog = () => ({
  type: HIDE
})
