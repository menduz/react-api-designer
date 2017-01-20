//@flow

import React, {Component} from 'react'
import {connect} from 'react-redux'
import Header from '../header/Header'
import Split from '../split/Split'
import Editor from '../editor/Editor'
import Menu from '../menu/Menu'
import * as fileSystemTree from '../../file-system-tree';
import {Info} from '../info'
import './App.css';

const Tree = fileSystemTree.FileSystemTree

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header/>
        <Split id="leftSplit" defaultSize={200}>
          <div className="LeftPanel">
              <Menu/>
              <Tree/>
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
