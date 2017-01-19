//@flow

import React, {Component} from 'react'
import cx from 'classnames'
import Tree from 'react-ui-tree'
import SplitPane from 'react-split-pane'
import Spinner from '@mulesoft/anypoint-components/lib/Spinner'
import tree from './tree.json';
import { parseText, suggest } from './actions'
import DesignerEditor from './components/editor/Editor'
import {connect} from 'react-redux'
import {Info} from './components/info'
import './App.css';

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      tree: tree,
      active: null,
      suggestions: [],
    }
  }

  onTextChange = (newValue, event) => {
    this.props.onValueChange(newValue, event)
  }

  suggestions(position) {
    this.props.onSuggest(this.props.text, position)
  }

  handleChange(tree) {
    this.setState({tree})
  }

  onClickNode(node) {
    // if (!node.leaf) {
    //   node.collapsed = !node.collapsed
    // }

    this.setState({
      active: node
    })
  }

  renderNode(node) {
    return (
      <span className={cx('node', { 'is-active': node === this.state.active })}
            onClick={this.onClickNode.bind(this, node)}>
        {node.module}
      </span>
    )
  }

  render() {
    const {text, errors, isParsing, suggestions} = this.props
    const {tree} = this.state
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
            <Tree className="Tree"
                  paddingLeft={20}
                  tree={tree}
                  isNodeCollapsed={this.isNodeCollapsed}
                  onChange={this.handleChange.bind(this)}
                  renderNode={this.renderNode.bind(this)}/>
          </div>

          <div className="RightPanel">
            <SplitPane split="vertical" primary="second"
                       minSize={10}
                       defaultSize={parseInt(localStorage.getItem('designer:preference:rightSplit') || 300, 10)}
                       onChange={size => localStorage.setItem('designer:preference:rightSplit', size)}>
              <div className="CodePanel">
                <DesignerEditor code={text}
                                onChange={this.onTextChange.bind(this)}
                                onSuggest={this.suggestions.bind(this)}
                                suggestions={suggestions}
                                errors={errors}
                                language="raml"/>
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
  const { parse, suggestion } = state
  return {
    lastUpdated: parse.lastUpdate,
    isParsing: parse.isParsing,
    errors: parse.errors,
    text: parse.text,
    suggestions: suggestion.suggestions
  }
}

const mapDispatch = dispatch => {
  return {
      onValueChange: value => dispatch(parseText(value)),
      onSuggest: (text, offset) => dispatch(suggest(text,offset))
  }
}

export default connect(mapStateToProps, mapDispatch)(App)
