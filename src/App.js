//@flow

import React, {Component} from 'react'
import {connect} from 'react-redux'
import Spinner from '@mulesoft/anypoint-components/lib/Spinner'
import Split from './components/split/Split'
import Editor from './components/editor/Editor'
import Menu from './components/menu/Menu'
import * as fileSystemTree from './file-system-tree';
import {Info} from './components/info'
import './App.css';

const Tree = fileSystemTree.FileSystemTree

class App extends Component {

  render() {
    const {isParsing} = this.props
    return (
      <div className="App">
        <div className="App-header">
          <h2>Api Designer</h2>
          {isParsing ? <Spinner size="s" className="Spinner-parser"/> : null}
        </div>
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
