//@flow

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import reducer from './reducers'
import WebWorker from './web-worker'

class Repository {
    constructor() {
        this.text= ''
    }
    getFile(path) {
        return this.text
    }
    setFile(text) {
        this.text = text
    }
}
const repository = new Repository()

const worker = new WebWorker(repository);

let thunkMiddleware = thunk.withExtraArgument({
    worker
});

const middleware = [thunkMiddleware]
if (process.env.NODE_ENV !== 'production') {
    middleware.push(createLogger())
}

const store = createStore(
    reducer,
    applyMiddleware(...middleware)
)

let listener = () => {
    if (repository) {
        const parse = store.getState().parse
        if (parse && parse.text) repository.setFile(parse.text)
    }
};
store.subscribe(listener)

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
