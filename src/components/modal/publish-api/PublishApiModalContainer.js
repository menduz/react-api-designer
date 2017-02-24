// @flow

import React from "react"
import {connect} from 'react-redux'

import {getAll} from './PublishApiSelectors'
import PublishApiModal from './PublishApiModal'

import type {State} from "./PublishApiModel"
import {changeValue, publish, clear, removeTag, addTag} from "./PublishApiActions"

type ContainerProps = {
  onClose: () => void
}

const mapState = (rootState) => {
  const state: State = getAll(rootState)
  return {
    name: state.form['name'],
    version: state.form['version'],
    tag: state.form['tag'],
    tags: [...state.form['tags']],
    isFetching: state.isFetching,
    isFetched: state.isFetched,
    link: state.link,
    error: state.error
  }
}

const mapDispatch = (dispatch, props: ContainerProps) => {
  return {
    onTagChange: (tag: string) => dispatch(changeValue('tag', tag)),
    onTagRemove: (tag: string) => dispatch(removeTag(tag)),
    onSubmitTag: (tag: string) => dispatch(addTag(tag)),
    onNameChange: (name: string) => dispatch(changeValue('name', name)),
    onVersionChange: (version: string) => dispatch(changeValue('version', version)),
    onSubmit: (name: string, version: string, tags: Array<string>) => dispatch(publish(name, version, tags)),
    onCancel: () => {
      dispatch(clear())
      if (props.onClose) props.onClose()
    }
  }
}

const PublishApiModalContainer = connect(mapState, mapDispatch)(PublishApiModal)

PublishApiModalContainer.propTypes = {
  onClose: React.PropTypes.func.isRequired
}

export default PublishApiModalContainer