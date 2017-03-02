//@flow

import React from 'react'

import Split from '../split/Split'
import Menu from '../menu/files-menu/Menu'
import DependencyMenu from '../menu/dependencies-menu/DependencyMenu'
import {Info} from '../info'
import {Editor} from '../editor'
import {FileSystemTreeContainer} from '../tree'
import FileDrop from '../filedrop/FileDrop'
import Toasts from '../toasts/Toasts'

import './App.css'

const App = () => (
  <FileDrop className='App' testId="App">
    <Split id="leftSplit" minSize={150} defaultSize={200} className="App-content">
      <div className="LeftPanel">
        <Menu/>
        <FileSystemTreeContainer/>
        <DependencyMenu/>
      </div>
      <Split id="rightSplit" minSize={300} defaultSize={400} position="right" className="RightPanel">
        <Editor/>
        <Info/>
      </Split>
    </Split>
    <Toasts/>
  </FileDrop>
)

export default App