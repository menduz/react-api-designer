//@flow

import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import WebWorker from './web-worker'

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {errors: []}

    this.worker = new WebWorker({
      getFile: (path) => {
        return this.editor.value
      }
    });
  }

  parseRaml(path) {
    const promise = this.worker.ramlParse(path);
    if (promise) {
      promise.then(result => {
        this.setState({
          raml: result.specification,
          errors: result.errors
        })
      }).catch(error => {
        if (error === 'aborted') console.log('aborting old parse request for', path)
        else this.setState({errors: [error]}) // unexpected error
      })
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

        <textarea rows="10" cols="100"
                  ref={(editor) => { this.editor = editor; }}
                  onKeyUp={this.parseRaml.bind(this, 'api.raml')}
                  defaultValue="#%RAML 1.0"/>
        <ul>
          {
            this.state.errors.map(error =>
              <li>{error.message}</li>
            )
          }
        </ul>

        <textarea value={JSON.stringify(this.state.raml, null, 2)} rows="10" cols="100" disabled/>

      </div>
    );
  }
}

export default App;
