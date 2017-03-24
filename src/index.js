//@flow

import React from "react"
import ReactDOM from "react-dom"
import App from "./components/app/App"
import "./index.css"
import {createStore, applyMiddleware, combineReducers} from "redux"
import {addErrorToasts} from './components/toasts/actions'
import {Provider} from "react-redux"
import thunk from "redux-thunk"
import reduxLogger from "redux-logger"
import reduxCatch from 'redux-catch'
import * as component from "./component"
import {getLocationQueryVariable} from './bootstrap/util'
import {Header} from './components/header'

// mock some initial config
const authSelectors = {
  authorization: () => `Bearer ${getLocationQueryVariable('token')}`,
  ownerId: () => 'edc150a4-8365-4b1a-adfa-0dc1dc63227b',
  organizationId: () => 'e2c426f7-6844-4a29-8435-f74ce0ef5333',
  organizationDomain: () => 'mulesoft-inc'
}

const errorHandler = (error, getState, lastAction, dispatch) => {
  dispatch(addErrorToasts(error))
}

// create middleware
const thunkExtraArg = component.initThunkArg(authSelectors)
const thunkMiddleware = thunk.withExtraArgument(thunkExtraArg)
const middleware = [reduxCatch(errorHandler), thunkMiddleware]
if (location.search.indexOf('redux-logger=true') > -1) {
  middleware.push(reduxLogger())
}

// create store
const store = createStore(
  combineReducers(component.reducers),
  applyMiddleware(...middleware)
)

const projectId = getLocationQueryVariable('projectId')
const projectDir = getLocationQueryVariable('projectDir')
if (projectId) {
  store.dispatch(component.actions.init(projectId, getLocationQueryVariable('projectType')))
} else if (projectDir) {
  store.dispatch(component.actions.initElectron(projectDir))
} else {
  store.dispatch(component.actions.initLocalStorage())
}

ReactDOM.render(
  <Provider store={store}>
    <div>
      <Header/>
      <App/>
    </div>
  </Provider>,
  document.getElementById('root')
)