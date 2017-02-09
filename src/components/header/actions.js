import Storage from '../../Storage'

export const CHANGE_THEME = `DESIGNER/HEADER/CHANGE_THEME`

export const changeTheme = (theme: string) => {
  Storage.setValue('theme', theme)
  return {
    type: CHANGE_THEME,
    payload: {theme}
  }
}