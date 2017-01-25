//@flow

import React from 'react'
import {connect} from 'react-redux'

import NewFolderModalContainer from '../modal/new-folder/NewFolderModalContainer'
import NewFileModalContainer from '../modal/new-file/NewFileModalContainer'

import {openNewFolderDialog} from '../modal/new-folder/NewFolderActions'
import {openNewFileDialog} from '../modal/new-file/NewFileActions'

import './Menu.css'
import {saveCurrentFile} from "../editor/actions"

class Menu extends React.Component {
  render() {
    let {
      showNewFolderDialog,
      showNewFileDialog,
      saveFile
    } = this.props
    return (
      <div className="menu">
        <button className="save-file-button" onClick={saveFile}/>
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
    showNewFileDialog: () => dispatch(openNewFileDialog()),
    saveFile: () => dispatch(saveCurrentFile())
  }
}

export default connect(mapState, mapDispatch)(Menu)
