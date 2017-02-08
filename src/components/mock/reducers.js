import {START_MOCK, STOP_MOCK, MOCK_STARTED, BEGIN_STOP_MOCK} from './actions'

const mock = (state = {
  isStarting: false,
  isUp:false,
  id:"",
  manageKey:"",
  baseUri:"",
  manageUri:"",
  isStopping:false
}, action) => {

  console.log("mockReducer " + JSON.stringify(action))

  if (state.file !== undefined && state.file !== action.file) {
    return state
  }
  console.log("Continue!")
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
        isUp:true,
        id: action.id,
        manageKey :action.manageKey,
        baseUri: action.baseUri,
        manageUri: action.manageUri,
        isStarting: false
      }
    case STOP_MOCK:
      return {
        ...state,
        isStarting: false,
        isStopping: false,
        isUp:false,
        id: "",
        manageKey :"",
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

export default  (state = [], action) => {

  switch (action.type) {
    case START_MOCK:
      const c = state.find(c => c.file === action.file)

      if (!c) {
        console.log("c: " + c)
        return [
          ...state,
          mock(undefined, action)
        ]
      } else {
        console.log("c: " + c)

        return state.map(t =>
          mock(t, action)
        )
      }
    case MOCK_STARTED:
    case STOP_MOCK:
    case BEGIN_STOP_MOCK:
      const newState =  state.map(t =>
        mock(t, action)
      )
      console.log("newState: " + JSON.stringify(newState))
      return newState

    default:
      return state

  }

}


