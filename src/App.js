//@flow

import React, {Component} from 'react';
import cx from 'classnames';
import Tree from 'react-ui-tree'
import SplitPane from 'react-split-pane'
import TabPanel from '@mulesoft/anypoint-components/lib/TabPanel'
import TabList from '@mulesoft/anypoint-components/lib/TabList'
import Tab from '@mulesoft/anypoint-components/lib/Tab'
import Tabs from '@mulesoft/anypoint-components/lib/Tabs'
import tree from './tree.json';
import { parseText } from './actions'

// import logo from './logo.svg';
import DesignerEditor from './Editor/Editor'
import './App.css';
import { connect } from 'react-redux'


import WebWorker from './web-worker'

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      tree: tree,
      active: null,
      selectedTab: parseInt(localStorage.getItem('designer:preference:selectedTab') || 0),
      errors: [],
      editor: {value: '#%RAML 1.0'}
    }

    this.worker = new WebWorker({
      getFile: (path) => {
        return this.state.editor.value
      }
    });
  }

  handleKeyUp = (event, newValue ) => {
    //event.preventDefault()
    //console.log("LECKO" + JSON.stringify(event) + " newValue:" + JSON.stringify(newValue))
    // if (key === 'Enter') {
    this.props.dispatch(parseText(event))
    // this.setState({
    //   editor: {value: newValue}
    // })

    // }
  }

  // parseRaml(path, code) {
  //   const promise = this.worker.ramlParse(path);
  //   if (promise) {
  //     promise.then(result => {
  //       this.setState({
  //         raml: result.specification,
  //         errors: result.errors,
  //         editor: {value: code}
  //       })
  //     }).catch(error => {
  //       if (error === 'aborted') console.log('aborting old parse request for', path)
  //       else this.setState({
  //         errors: [error],
  //         editor: {value: code}
  //       }) // unexpected error
  //     })
  //   }
  // }

  onTabSelect(selectedTab) {
    this.setState({selectedTab})
    localStorage.setItem('designer:preference:selectedTab', selectedTab)
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
    });
  }

  renderNode(node) {
    return (
      <span className={cx('node', { 'is-active': node === this.state.active })}
            onClick={this.onClickNode.bind(this, node)}>
        {node.module}
      </span>
    );
  }

  render() {
    const { isPending, text, errors, isParsing, parsedText} = this.props
    return (
      <div className="App">
        <div className="App-header">
          <h2>Api Designer</h2>
        </div>
        <SplitPane split="vertical"
                   minSize={10}
                   defaultSize={parseInt(localStorage.getItem('designer:preference:leftSplit') || 150, 10)}
                   onChange={size => localStorage.setItem('designer:preference:leftSplit', size)}>
          <div className="TreePanel">
            <Tree
              className="Tree"
              paddingLeft={20}
              tree={this.state.tree}
              isNodeCollapsed={this.isNodeCollapsed}
              onChange={this.handleChange.bind(this)}
              renderNode={this.renderNode.bind(this)}
            />
          </div>

          <div className="RightPanel">
            <SplitPane split="vertical" primary="second"
                       minSize={10}
                       defaultSize={parseInt(localStorage.getItem('designer:preference:rightSplit') || 300, 10)}
                       onChange={size => localStorage.setItem('designer:preference:rightSplit', size)}>
              <div className="CodePanel">
                <h3>RAML Monaco editor</h3>
                <DesignerEditor
                  code={text}
                  onChange={this.handleKeyUp.bind(this)}
                  onSuggest={position => null}
                  suggestions={this.state.suggestions}
                  errors={this.state.errors}
                  language="raml"
                />

                <h3>JSON Monaco editor</h3>
                <DesignerEditor
                  code="{}"
                  language="json"
                />
              </div>
              <div className="InfoPanel">
                <Tabs selectedIndex={this.state.selectedTab}>
                  <TabList>
                    <Tab onClick={this.onTabSelect.bind(this, 0)}>Preview</Tab>
                    <Tab onClick={this.onTabSelect.bind(this, 1)}>Errors</Tab>
                  </TabList>
                  <TabPanel>
                    {this.state.selectedTab === 0 &&
                    <pre>
                      {JSON.stringify(parsedText, null, 2)}
                    </pre>
                    }
                  </TabPanel>
                  <TabPanel>
                    {this.state.selectedTab === 1 &&
                    <pre>
                      {JSON.stringify(this.state.errors, null, 2)}
                    </pre>
                    }
                  </TabPanel>
                </Tabs>
              </div>
            </SplitPane>
          </div>
        </SplitPane>
      </div>
    );
  }
}


const mapStateToProps = state => {
  const { parse } = state
  return {
    lastUpdated: parse.lastUpdate,
    isParsing:parse.isParsing,
    errors:parse.errors,
    text:parse.text,
    parsedText:parse.parsedText,
  }
}

export default connect(mapStateToProps)(App)

