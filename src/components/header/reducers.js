import {CHANGE_THEME, SHOW_INFO_PANEL_TABS, TOGGLE_CONSUME_MODE, TOGGLE_EXCHANGE_MODE,
  PUBLISH_TO_EXCHANGE_MODE} from './actions'
import Storage from '../../storage'

const initialState = {
  theme: Storage.getValue('theme', 'vs'),
  showInfoPanelTabs: Storage.getValue('showInfoPanelTabs', 'false') === 'true',
  isExchangeMode: Storage.getValue('isExchangeMode', 'true') === 'true',
  isConsumeMode: Storage.getValue('isConsumeMode', 'false') === 'true',
  publishToExchange: Storage.getValue('publishToExchange', 'false') === 'true'
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
        isConsumeMode: action.payload
      }
    case TOGGLE_EXCHANGE_MODE:
      return {
        ...state,
        isExchangeMode: action.payload
      }
    case PUBLISH_TO_EXCHANGE_MODE:
      return {
        ...state,
        publishToExchange: action.payload
      }
    default:
      return state
  }
}