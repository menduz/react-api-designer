//@flow

import React, {Component} from 'react'
import Header from '../header/Header'
import Split from '../split/Split'
import Menu from '../menu/Menu'
import {Info} from '../info'
import {Editor} from '../editor'
import {FileSystemTree} from '../tree'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header/>
        <Split id="leftSplit" minSize={150} defaultSize={200} className="App-content">
          <div className="LeftPanel">
            <Menu/>
            <FileSystemTree/>
          </div>
          <Split id="rightSplit" minSize={300} defaultSize={400} position="right" className="RightPanel">
            <Editor/>
            <Info/>
          </Split>
        </Split>
      </div>
    )
  }
}

export default App
