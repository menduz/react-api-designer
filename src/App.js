//@flow

import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import WebWorker from './web-worker'

class App extends Component {

  constructor(props) {
    super(props)

    this.state = { errors: [] }

    this.worker = new WebWorker({
      getFile: (path) => {
        return this.editor.value
      }
    });
  }

  parserRaml() {
    this.worker.parserRaml('/api.raml').then(result => {
      console.log(result)
      this.setState({errors:result.errors})
    }).catch(error => {
      console.error(error)
      // unexpected
      this.setState({errors:[error]})
    })
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
                  onKeyUp={this.parserRaml.bind(this)}
                  defaultValue="#%RAML 1.0"/>
        <ul>
          {
            this.state.errors.map(error =>
              <li>{error.message}</li>
            )
          }
        </ul>

      </div>
    );
  }
}

export default App;
