import {CHANGE_THEME, SHOW_INFO_PANEL_TABS, TOGGLE_ANY_POINT_MODE} from './actions'
import Storage from '../../Storage'

const initialState = {
  theme: Storage.getValue('theme', 'vs'),
  showInfoPanelTabs: Storage.getValue('showInfoPanelTabs', 'true') === 'true',
  isAnyPointMode: Storage.getValue('isAnyPointMode', 'true') === 'true'
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
    case TOGGLE_ANY_POINT_MODE:
      return {
        ...state,
        isAnyPointMode: action.payload.changeMode
      }
    default:
      return state
  }
}