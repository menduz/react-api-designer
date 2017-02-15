// @flow

import * as actions from './PublishApiActions'
import type {State} from  './PublishApiModel'

const initialState: State = {
  form: {},
  isFetching: false,
  isFetched: false,
  isOpen: false
}

export default (state: State = initialState, action: any): State => {
  switch (action.type) {
    case actions.CLEAR:
      return initialState
    case actions.OPEN:
      return {
        ...state,
        isOpen: true
      }
    case actions.CHANGE_VALUE:
      return {
        ...state,
        form: {
          ...state.form,
          [action.payload.name]: action.payload.value
        }
      }
    case actions.START_FETCHING:
      return {
        ...state,
        isFetching: true,
        isFetched: false,
        link: undefined,
        error: undefined
      }
    case actions.SUCCESSFULLY_FETCH:
      return {
        ...state,
        isFetching: false,
        isFetched: true,
        link: action.payload.link
      }
    case actions.PUBLISH_ERROR:
      return {
        ...state,
        isFetching: false,
        isFetched: false,
        link: undefined,
        error: action.payload.error
      }
  }

  return state
}