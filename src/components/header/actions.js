import Storage from '../../Storage'

export const CHANGE_THEME = `DESIGNER/HEADER/CHANGE_THEME`
export const SHOW_INFO_PANEL_TABS = `DESIGNER/HEADER/SHOW_TABS`
export const TOGGLE_EXCHANGE_MODE = `DESIGNER/HEADER/TOGGLE_EXCHANGE_MODE`
export const TOGGLE_CONSUME_MODE = `DESIGNER/HEADER/TOGGLE_CONSUME_MODE`
export const PUBLISH_TO_EXCHANGE_MODE = `DESIGNER/HEADER/PUBLISH_TO_EXCHANGE_MODE`

export const changeTheme = (theme: string) => {
  Storage.setValue('theme', theme)
  return {
    type: CHANGE_THEME,
    payload: {theme}
  }
}

export const changeConsumeMode = (changeMode: boolean) => {
  Storage.setValue('isConsumeMode', changeMode)
  return {
    type: TOGGLE_CONSUME_MODE,
    payload: changeMode
  }
}

export const changeExchangeMode = (changeMode: boolean) => {
  Storage.setValue('isExchangeMode', changeMode)
  return {
    type: TOGGLE_EXCHANGE_MODE,
    payload: changeMode
  }
}

export const showInfoPanelTabs = (showTabs: boolean) => {
  Storage.setValue('showInfoPanelTabs', showTabs)
  return {
    type: SHOW_INFO_PANEL_TABS,
    payload: {showTabs}
  }
}

export const changePublishExchange = (changeMode: boolean) => {
  Storage.setValue('publishToExchange', changeMode)
  return {
    type: PUBLISH_TO_EXCHANGE_MODE,
    payload: changeMode
  }
}