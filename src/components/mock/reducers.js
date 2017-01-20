import {START_MOCK, STOP_MOCK, MOCK_STARTED, BEGIN_STOP_MOCK} from './actions'

export default(state = {
  isStarting: false,
  isUp:false,
  id:"",
  manageKey:"",
  baseUri:"",
  manageUri:"",
  isStopping:false
}, action) => {
  switch (action.type) {
    case START_MOCK:
      return {
        ...state,
        isStarting: true
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
