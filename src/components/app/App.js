//@flow

import React from 'react'
import {connect} from 'react-redux'

import Header from '../header/Header'
import Split from '../split/Split'
import Menu from '../menu/Menu'
import {Info} from '../info'
import {Editor} from '../editor'
import {FileSystemTree} from '../tree'
import {openImportDialog} from '../../components/modal/import/ImportActions'

import './App.css'

class App extends React.Component {

  onDrop(event) {
    event.stopPropagation()
    event.preventDefault()

    if (event.dataTransfer && event.dataTransfer.files) {
      var files = event.dataTransfer.files
      if (files.length > 0) {
        this.props.openDialog(files[0])
      }
    }
  }

  render() {
    return (
      <div className="App"
           onDragOver={event => event.preventDefault()}
           onDrop={this.onDrop.bind(this)}>
        <Header/>
        <Split id="leftSplit" minSize={150} defaultSize={200} className="App-content">
          <div className="LeftPanel">
            <Menu/>
            <FileSystemTree/>
          </div>
          <Split id="rightSplit" minSize={300} defaultSize={400} position="right" className="RightPanel">
            <Editor/>
            <Info/>
          </Split>
        </Split>
      </div>
    )
  }
}

const mapDispatch = (dispatch) => {
  return {
    openDialog: (file) => dispatch(openImportDialog(file))
  }
}

export default connect(null, mapDispatch)(App)
