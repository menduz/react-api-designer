//@flow

import React, {Component} from 'react'
import {connect} from 'react-redux'
import SplitPane from 'react-split-pane'
import Spinner from '@mulesoft/anypoint-components/lib/Spinner'
import Editor from './components/editor/Editor'
import Menu from './components/menu/Menu'
import * as fileSystemTree from './file-system-tree';
import {Info} from './components/info'
import './App.css';

const Tree = fileSystemTree.FileSystemTree

class App extends Component {

  static leftKey = 'designer:preference:leftSplit'
  static rightKey = 'designer:preference:rightSplit'

  render() {
    const {isParsing} = this.props
    return (
      <div className="App">
        <div className="App-header">
          <h2>Api Designer</h2>
          {isParsing ? <Spinner size="s" className="Spinner-parser"/> : null}
        </div>
        <SplitPane split="vertical" minSize={10}
                   defaultSize={parseInt(localStorage.getItem(App.leftKey) || 150, 10)}
                   onChange={size => localStorage.setItem(App.leftKey, size)}>
          <div className="TreePanel">
              <Menu/>
              <Tree/>
          </div>
          <div className="RightPanel">
            <SplitPane split="vertical" primary="second" minSize={10}
                       defaultSize={parseInt(localStorage.getItem(App.rightKey) || 300, 10)}
                       onChange={size => localStorage.setItem(App.rightKey, size)}>
              <Editor/>
              <Info/>
            </SplitPane>
          </div>
        </SplitPane>
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
