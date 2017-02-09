import {CHANGE_THEME, SHOW_INFO_PANEL_TABS} from './actions'
import Storage from '../../Storage'

const initialState = {
  theme: Storage.getValue('theme', 'vs'),
  showInfoPanelTabs: Storage.getValue('showInfoPanelTabs', 'true') === 'true'
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
    default:
      return state
  }
}