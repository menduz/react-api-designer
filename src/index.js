//@flow

import React from "react";
import ReactDOM from "react-dom";
import App from "./components/app/App";
import "./index.css";
import {createStore, applyMiddleware, combineReducers} from "redux";
import {Provider} from "react-redux";
import thunk from "redux-thunk";
import reduxLogger from "redux-logger";
import * as component from "./component";
import {Header} from './components/header'

// mock some initial config
const authSelectors = {
  authorization: () => `Bearer bd516ec3-75fb-484b-969f-5802f50e5e01`,
  ownerId: () => 'd365610a-8e56-42da-a3fc-73b548371cc6',
  organizationId: () => 'b13cbf39-787d-4d1f-9c72-22275ecc0d59',
  organizationDomain: () => 'mulesoft-inc'
}

// create middleware
const thunkExtraArg = component.initThunkArg(authSelectors);
const thunkMiddleware = thunk.withExtraArgument(thunkExtraArg)
const middleware = [thunkMiddleware]
if (location.search.indexOf('redux-logger=true') > -1) {
  middleware.push(reduxLogger())
}

// create store
const store = createStore(
  combineReducers(component.reducers),
  applyMiddleware(...middleware)
)

// dispatch init with no project id for a sandbox standalone version
const projectId = ''
// const projectId = '0e4a85aa-3ac2-46a7-97f4-c53637243e87'
store.dispatch(component.actions.init(projectId))

ReactDOM.render(
  <Provider store={store}>
    <div>
      <Header/>
      <App/>
    </div>
  </Provider>,
  document.getElementById('root')
)