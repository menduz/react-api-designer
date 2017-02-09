import {CHANGE_THEME} from './actions'
import Storage from '../../Storage'

const initialState = {theme: Storage.getValue('theme', 'vs')}

export default(state = initialState, action) => {
  switch (action.type) {
    case CHANGE_THEME:
      return {
        ...state,
        theme: action.payload.theme
      }
    default:
      return state
  }
}