// @flow

export const CHANGE_NAME = 'newFolder/CHANGE_NAME';
export const CLEAR = 'newFolder/CLEAR';
export const SHOW = 'newFolder/SHOW_DIALOG';
export const HIDE = 'newFolder/HIDE_DIALOG';

export const changeName = (name: string) => ({
  type: CHANGE_NAME,
  payload: name
});

export const openNewFolderDialog = () => ({
  type: SHOW
})

export const closeNewFolderDialog = () => ({
  type: HIDE
})
