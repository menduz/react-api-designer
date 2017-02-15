//@flow

import React from 'react'

import {Header} from '../header'
import Split from '../split/Split'
import Menu from '../menu/Menu'
import {Info} from '../info'
import {Editor} from '../editor'
import {FileSystemTreeContainer} from '../tree'
import FileDrop from '../filedrop/FileDrop'

import './App.css'

export default class App extends React.Component {

  render() {
    return (
      <FileDrop className='App' testId="App">
        <Header/>
        <Split id="leftSplit" minSize={150} defaultSize={200} className="App-content">
          <div className="LeftPanel">
            <Menu/>
            <FileSystemTreeContainer/>
          </div>
          <Split id="rightSplit" minSize={300} defaultSize={400} position="right" className="RightPanel">
            <Editor/>
            <Info/>
          </Split>
        </Split>
      </FileDrop>
    )
  }
}
