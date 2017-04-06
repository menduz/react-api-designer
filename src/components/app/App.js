//@flow

import React, {Component} from 'react'
import {connect} from "react-redux"

import Menu from '../menu/files-menu/Menu'
import DependencyMenu from '../menu/dependencies-menu/DependencyMenu'
import {Info} from '../info'
import {Editor} from '../editor'
import {FileSystemTreeContainer} from '../tree'
import {DependenciesTreeContainer} from '../dependencies-tree'
import {MessageModal} from '../modal/message'
import FileDrop from '../filedrop/FileDrop'
import Toasts from '../toasts/Toasts'
import {UnsavedModal} from '../modal/unsaved'
import {isConsumeMode} from "../header/selectors"
import {hasProjectSelected} from "../../bootstrap/selectors"
import ResizablePanelWrapper from "../resizable-panel/ResizablePanelWrapper"

import './App.css'


class App extends Component {
  render() {
    const {isConsumeMode} = this.props

    return (
      <FileDrop className='App' testId="App">
        <div className="App-content">
          <ResizablePanelWrapper id="left-panel" minWidth="200" position="left">
            <div>
              <Menu/>
              <FileSystemTreeContainer/>
              {isConsumeMode ? <DependencyMenu/> : null}
              {isConsumeMode ? <DependenciesTreeContainer/> : null}
            </div>
          </ResizablePanelWrapper>
          <div className="mid-container">
            <Editor/>
          </div>
          <ResizablePanelWrapper id="right-panel" minWidth="300" position="right">
            <Info/>
          </ResizablePanelWrapper>
        </div>

        <Toasts/>
        <MessageModal/>
        <UnsavedModal/>
      </FileDrop>
    )
  }
}


const mapStateToProps = state => {
  return {
    isConsumeMode: isConsumeMode(state) && hasProjectSelected(state)
  }
}

export default connect(mapStateToProps)(App)