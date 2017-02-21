// @flow

import React from "react"
import {connect} from 'react-redux'

import {getAll} from './PublishApiSelectors'
import PublishApiModal from './PublishApiModal'

import type {State} from "./PublishApiModel"
import {changeValue, publish, clear, removeTag, addTag} from "./PublishApiActions"
import PublishApiRemoteApi from "../../../vcs-api/PublishApiRemoteApi"

type ContainerProps = {
  onClose: () => void,
  baseUrl: string,
  projectId: string,
  ownerId: string,
  organizationId: string,
  authorization: string
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
  const remoteApi = new PublishApiRemoteApi(
    props.baseUrl,
    props.projectId,
    props.ownerId,
    props.organizationId,
    props.authorization)

  return {
    onTagChange: (tag: string) => dispatch(changeValue('tag', tag)),
    onTagRemove: (tag: string) => dispatch(removeTag(tag)),
    onSubmitTag: (tag: string) => dispatch(addTag(tag)),
    onNameChange: (name: string) => dispatch(changeValue('name', name)),
    onVersionChange: (version: string) => dispatch(changeValue('version', version)),
    onSubmit: (name: string, version: string, tags: Array<string>) => dispatch(publish(remoteApi, name, version, tags)),
    onCancel: () => {
      dispatch(clear())
      if (props.onClose) props.onClose()
    }
  }
}

const PublishApiModalContainer = connect(mapState, mapDispatch)(PublishApiModal)

PublishApiModalContainer.propTypes = {
  onClose: React.PropTypes.func.isRequired,
  baseUrl: React.PropTypes.string,
  projectId: React.PropTypes.string,
  ownerId: React.PropTypes.string,
  organizationId: React.PropTypes.string,
  authorization: React.PropTypes.string
}

export default PublishApiModalContainer