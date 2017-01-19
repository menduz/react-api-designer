//@flow

export const CHANGE_TYPE = 'newFile/CHANGE_TYPE'
export const CHANGE_NAME = 'newFile/CHANGE_NAME'
export const SHOW = 'newFile/SHOW_DIALOG'
export const HIDE = 'newFile/HIDE_DIALOG'

export const changeFileType = (type: string) => ({
  type: CHANGE_TYPE,
  payload: type
})

export const changeName = (name: string) => ({
  type: CHANGE_NAME,
  payload: name
})

export const openNewFileDialog = () => ({
  type: SHOW
})

export const closeNewFileDialog = () => ({
  type: HIDE
})
