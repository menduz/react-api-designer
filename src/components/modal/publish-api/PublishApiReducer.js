// @flow

import * as actions from './PublishApiActions'
import type {State} from  './PublishApiModel'

const initialState: State = {
  form: {tags: new Set()},
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

    case actions.ADD_TAG:
      var tags = state.form['tags']

      return {
        ...state,
        form: {
          ...state.form,
          tags: tags ? tags.add(action.payload.tag) : new Set([action.payload.tag]),
          tag: undefined
        }
      }
    case actions.REMOVE_TAG:
      var tags = state.form['tags']
      tags.delete(action.payload.tag)

      return {
        ...state,
        form: {
          ...state.form,
          tags: tags
        }
      }
  }

  return state
}