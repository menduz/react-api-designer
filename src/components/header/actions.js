import Storage from '../../Storage'

export const CHANGE_THEME = `DESIGNER/HEADER/CHANGE_THEME`
export const SHOW_INFO_PANEL_TABS = `DESIGNER/HEADER/SHOW_TABS`

export const changeTheme = (theme: string) => {
  Storage.setValue('theme', theme)
  return {
    type: CHANGE_THEME,
    payload: {theme}
  }
}

export const showInfoPanelTabs = (showTabs: boolean) => {
  Storage.setValue('showInfoPanelTabs', showTabs)
  return {
    type: SHOW_INFO_PANEL_TABS,
    payload: {showTabs}
  }
}