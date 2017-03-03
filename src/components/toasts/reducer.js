import {ADD_TOAST, REMOVE_TOAST} from './actions'

const initialState = {
  toasts: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TOAST:
      return {
        ...state,
        toasts: [
          ...state.toasts,
          action.toast
        ]
      }
    case REMOVE_TOAST:
      var removedToast = state.toasts.filter(t => t.title === action.toastTitle)
      return {
        ...state,
        toasts: removedToast
      }
    default:
      return initialState
  }
}
