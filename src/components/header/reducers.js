import {CHANGE_THEME, SHOW_INFO_PANEL_TABS, TOGGLE_CONSUME_MODE, TOGGLE_EXCHANGE_MODE} from './actions'
import Storage from '../../Storage'

const initialState = {
  theme: Storage.getValue('theme', 'vs'),
  showInfoPanelTabs: Storage.getValue('showInfoPanelTabs', 'true') === 'true',
  isExchangeMode: Storage.getValue('isExchangeMode', 'true') === 'true',
  isConsumeMode: Storage.getValue('isConsumeMode', 'true') === 'true'
}

export default(state = initialState, action) => {
  switch (action.type) {
    case CHANGE_THEME:
      return {
        ...state,
        theme: action.payload.theme
      }
    case SHOW_INFO_PANEL_TABS:
      return {
        ...state,
        showInfoPanelTabs: action.payload.showTabs
      }
    case TOGGLE_CONSUME_MODE:
      return {
        ...state,
        isConsumeMode: action.payload.changeMode
      }
    case TOGGLE_EXCHANGE_MODE:
      return {
        ...state,
        isExchangeMode: action.payload.changeMode
      }
    default:
      return state
  }
}