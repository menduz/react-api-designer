import {CHANGE_THEME, TOGGLE_CONSUME_MODE, TOGGLE_EXCHANGE_MODE, PUBLISH_TO_EXCHANGE_MODE} from './actions'
import Storage from '../../storage'

const initialState = {
  theme: Storage.getValue('theme', 'vs'),
  isExchangeMode: Storage.getValue('isExchangeMode', 'true') === 'true',
  isConsumeMode: Storage.getValue('isConsumeMode', 'true') === 'true',
  publishToExchange: Storage.getValue('publishToExchange', 'true') === 'true'
}

export default(state = initialState, action) => {
  switch (action.type) {
    case CHANGE_THEME:
      return {
        ...state,
        theme: action.payload.theme
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