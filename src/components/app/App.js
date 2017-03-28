//@flow

import React, {Component} from 'react'
import {connect} from "react-redux";

import Split from '../split/Split'
import Menu from '../menu/files-menu/Menu'
import DependencyMenu from '../menu/dependencies-menu/DependencyMenu'
import {Info} from '../info'
import {Editor} from '../editor'
import {FileSystemTreeContainer} from '../tree'
import {DependenciesTreeContainer} from '../dependencies-tree'
import FileDrop from '../filedrop/FileDrop'
import Toasts from '../toasts/Toasts'
import {UnsavedModal} from '../modal/unsaved'
import {isConsumeMode} from "../header/selectors";
import {hasProjectSelected} from "../../bootstrap/selectors";
import './App.css'


class App extends Component {
  render() {
    const {isConsumeMode} = this.props

    return (<FileDrop className='App' testId="App">
        <Split id="leftSplit" minSize={150} defaultSize={200} className="App-content">
          <div className="LeftPanel">
            <Menu/>
            <FileSystemTreeContainer/>
            {isConsumeMode ? <DependencyMenu/> : null}
            {isConsumeMode ? <DependenciesTreeContainer/> : null}
          </div>
          <Split id="rightSplit" minSize={300} defaultSize={400} position="right" className="RightPanel">
            <Editor/>
            <Info/>
          </Split>
        </Split>
        <Toasts/>
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