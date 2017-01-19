//@flow

import React from 'react'
import {connect} from 'react-redux'

import NewFolderModalContainer from '../modal/new-folder/NewFolderModalContainer'
import NewFileModalContainer from '../modal/new-file/NewFileModalContainer'

import {openNewFolderDialog} from '../modal/new-folder/NewFolderActions'
import {openNewFileDialog} from '../modal/new-file/NewFileActions'

import './Menu.css'

class Menu extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let {
      showNewFolderDialog,
      showNewFileDialog
    } = this.props
    return (
      <div className="menu">
        <button className="new-file-button" onClick={showNewFileDialog}/>
        <NewFileModalContainer/>

        <button className="new-folder-button" onClick={showNewFolderDialog}/>
        <NewFolderModalContainer/>
      </div>
    )
  }
}

const mapState = (state) => {
  return {
    name: state.name
  }
}

const mapDispatch = (dispatch) => {
  return {
    showNewFolderDialog: () => dispatch(openNewFolderDialog()),
    showNewFileDialog: () => dispatch(openNewFileDialog())
  }
}

export default connect(mapState, mapDispatch)(Menu)
