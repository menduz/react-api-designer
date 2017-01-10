//@flow

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const converterWorker = new Worker(`${process.env.PUBLIC_URL}/build/static/js/api-designer-worker.js`)

converterWorker.addEventListener('message', (e) => {
  const response = e.data
  console.log(response)

  switch (response.type) {

    case 'raml-parse-resolve':
      break

    case 'raml-parse-reject':
      break

    case 'request-file':
      converterWorker.postMessage({
        type: 'request-file',
        path: '/api.raml',
        content: '#%RAML 1.0\ntitle: My Raml'
      })
      break

  }

}, false)

converterWorker.postMessage({
  type: 'raml-parse',
  path: '/api.raml'
})

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
