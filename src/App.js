//@flow

import React, {Component} from 'react'
import SplitPane from 'react-split-pane'
import Spinner from '@mulesoft/anypoint-components/lib/Spinner'
import Editor from './components/editor/Editor'
import Menu from './components/menu/Menu'
import * as fileSystemTree from './file-system-tree';
import {connect} from 'react-redux'
import {Info} from './components/info'
import './App.css';

const Tree = fileSystemTree.FileSystemTree

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      selectedTab: parseInt(localStorage.getItem('designer:preference:selectedTab') || 0, 10),
      errors: [],
      suggestions: [],
    }
  }

  onTextChange = (newValue, event) => {
    this.props.onValueChange(newValue, event)
  }

  suggestions(position) {
    this.props.onSuggest(this.props.text, position)
  }

  render() {
    const {text, errors, isParsing, suggestions, cursor} = this.props
    return (
      <div className="App">
        <div className="App-header">
          <h2>Api Designer</h2>
          {isParsing ? <Spinner size="s" className="Spinner-parser"/> : null}
        </div>
        <SplitPane split="vertical"
                   minSize={10}
                   defaultSize={parseInt(localStorage.getItem('designer:preference:leftSplit') || 150, 10)}
                   onChange={size => localStorage.setItem('designer:preference:leftSplit', size)}>
          <div className="TreePanel">
              <Menu className="menu"/>
              <Tree/>
          </div>

          <div className="RightPanel">
            <SplitPane split="vertical" primary="second"
                       minSize={10}
                       defaultSize={parseInt(localStorage.getItem('designer:preference:rightSplit') || 300, 10)}
                       onChange={size => localStorage.setItem('designer:preference:rightSplit', size)}>
              <div className="CodePanel">
                <Editor/>
              </div>
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
