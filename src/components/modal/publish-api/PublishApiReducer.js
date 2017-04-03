import * as actions from './PublishApiActions'
import * as constants from './PublishApiConstants'

const initialState = {
  form: {tags: new Set()},
  isFetching: {
    [constants.EXCHANGE]: false,
    [constants.PLATFORM]: false
  },
  isFetched: {
    [constants.EXCHANGE]: false,
    [constants.PLATFORM]: false
  },
  link: {
    [constants.EXCHANGE]: undefined,
    [constants.PLATFORM]: undefined
  },
  error: {
    [constants.EXCHANGE]: undefined,
    [constants.PLATFORM]: undefined
  },
  isOpen: false,
  publishToBothApis: false,
  isLoading: false
}

//TODO CHANGE LINK FOR RESPONSE
const successfullyFetchState = (state, response, source) => ({
    ...state,
    isFetching: {
      ...state.isFetching,
      [source]: false
    },
    isFetched: {
      ...state.isFetched,
      [source]: true
    },
    link: {
      ...state.link,
      [source]: response
    }
  })

const errorState = (state, error, source) => ({
    ...state,
    isFetching: {
      ...state.isFetching,
      [source]: false
    },
    isFetched: {
      ...state.isFetched,
      [source]: false
    },
    link: {
      ...state.link,
      [source]: undefined
    },
    error: {
      ...state.error,
      [source]: error
    }
  })

export default (state: State = initialState, action: any): State => {
  switch (action.type) {
    case actions.CLEAR:
      return initialState
    case actions.OPEN:
      return {
        ...state,
        isOpen: true,
        isLoading: true
      }
    case actions.FINISH_LOADING:
      return {
        ...state,
        isLoading: false
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
      switch (action.payload.source) {
        case constants.PLATFORM:
          return {
            ...state,
            isFetching: {
              [constants.EXCHANGE]: false,
              [constants.PLATFORM]: true
            },
            error: {
              [constants.EXCHANGE]: undefined,
              [constants.PLATFORM]: undefined
            }
          }
        case constants.EXCHANGE:
          return {
            ...state,
            isFetching: {
              [constants.EXCHANGE]: true,
              [constants.PLATFORM]: false
            },
            error: {
              [constants.EXCHANGE]: undefined,
              [constants.PLATFORM]: undefined
            }
          }
        case constants.BOTH:
          return {
            ...state,
            isFetching: {
              [constants.EXCHANGE]: true,
              [constants.PLATFORM]: true
            },
            error: {
              [constants.EXCHANGE]: undefined,
              [constants.PLATFORM]: undefined
            }
          }
        default:
          return state
      }
    case actions.PUBLISH_BOTH_APIS:
      return {
        ...state,
        publishToBothApis: action.payload.publishBoth
      }
    case actions.SUCCESSFULLY_FETCH:
      switch (action.payload.source) {
        case constants.PLATFORM:
          return successfullyFetchState(state, action.payload.response, constants.PLATFORM)
        case constants.EXCHANGE:
          return successfullyFetchState(state, action.payload.response, constants.EXCHANGE)
        default:
          return state
      }
    case actions.PUBLISH_ERROR:
      switch (action.payload.source) {
        case constants.PLATFORM:
          return errorState(state, action.payload.error, constants.PLATFORM)
        case constants.EXCHANGE:
          return errorState(state, action.payload.error, constants.EXCHANGE)
        default:
          return state
      }
    case actions.ADD_TAG:
      const addTags = new Set(state.form['tags'] || [])
      addTags.add(action.payload.tag)

      return {
        ...state,
        form: {
          ...state.form,
          tags: addTags,
          tag: undefined
        }
      }
    case actions.REMOVE_TAG:
      const removeTags = new Set(state.form['tags'])
      removeTags.delete(action.payload.tag)

      return {
        ...state,
        form: {
          ...state.form,
          tags: removeTags
        }
      }
    default:
      return state
  }
}