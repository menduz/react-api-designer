//@flow

import React, {Component} from 'react'
import {connect} from 'react-redux'
import Header from '../header/Header'
import Split from '../split/Split'
import Menu from '../menu/Menu'
import {Info} from '../info'
import {Editor} from '../editor'
import {FileSystemTree} from '../../file-system-tree'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header/>
        <Split id="leftSplit" defaultSize={200}>
          <div className="LeftPanel">
              <Menu/>
              <FileSystemTree/>
          </div>
          <Split id="rightSplit" defaultSize={350} primary="second" className="RightPanel">
            <Editor/>
            <Info/>
          </Split>
        </Split>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { editor } = state
  return {
    isParsing: editor.isParsing
  }
}

export default connect(mapStateToProps)(App)
