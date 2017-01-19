//@flow

export const CHANGE_TYPE = 'newFile/CHANGE_TYPE'
export const CHANGE_NAME = 'newFile/CHANGE_NAME'
export const CREATE = 'newFile/CREATE'
export const SHOW = 'newFile/SHOW_DIALOG'
export const HIDE = 'newFile/HIDE_DIALOG'

export const changeFileType = (type: string) => ({
  type: CHANGE_TYPE,
  payload: type
})

export const changeName = (type: string) => ({
  type: CHANGE_NAME,
  payload: type
})

export const createFile = (name: string, type: string) => ({
  //todo save file in filesystem
  type: CREATE
});

export const openNewFileDialog = () => ({
  type: SHOW
})

export const closeNewFileDialog = () => ({
  type: HIDE
})
