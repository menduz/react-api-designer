import {START_MOCK, STOP_MOCK, MOCK_STARTED, BEGIN_STOP_MOCK} from './actions'

const initialState = {
  baseUri: "",
  id: "",
  isStarting: false,
  isUp: false,
  isStopping: false,
  manageKey: "",
  manageUri: ""
}

const mock = (state = initialState, action) => {

  if (state.file !== undefined && state.file !== action.file) {
    return state
  }

  switch (action.type) {
    case START_MOCK:
      return {
        ...state,
        isStarting: true,
        file: action.file
      }
    case MOCK_STARTED:
      return {
        ...state,
        isUp: true,
        id: action.id,
        manageKey: action.manageKey,
        baseUri: action.baseUri,
        manageUri: action.manageUri,
        isStarting: false
      }
    case STOP_MOCK:
      return {
        ...state,
        isStarting: false,
        isStopping: false,
        isUp: false,
        id: "",
        manageKey: "",
        baseUri: "",
        manageUri: ""
      }
    case BEGIN_STOP_MOCK:
      return {
        ...state,
        isStopping: true
      }
    default:
      return state
  }
}

export default (state = [], action) => {

  switch (action.type) {
    case START_MOCK:
      const c = state.find(c => c.file === action.file)

      if (!c) {
        return [
          ...state,
          mock(undefined, action)
        ]
      } else {
        return state.map(t => mock(t, action))
      }
    case MOCK_STARTED:
    case STOP_MOCK:
    case BEGIN_STOP_MOCK:
      return state.map(t => mock(t, action))

    default:
      return state
  }
}


