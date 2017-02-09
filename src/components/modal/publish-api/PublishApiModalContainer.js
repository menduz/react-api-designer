// @flow

import React from "react"
import {connect} from 'react-redux'

import {getAll} from './PublishApiSelectors'
import PublishApiModal from './PublishApiModal'

import type {State} from "./PublishApiModel"
import {changeValue, publish, clear} from "./PublishApiActions"
import PublishApiRemoteApi from "../../../vcs-api/PublishApiRemoteApi"

const mapState = (rootState) => {
  const state: State = getAll(rootState)
  return {
    name: state.form['name'],
    version: state.form['version'],
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
    onNameChange: (name: string) => dispatch(changeValue('name', name)),
    onVersionChange: (version: string) => dispatch(changeValue('version', version)),
    onSubmit: (name: string, version: string) => dispatch(publish(remoteApi, name, version)),
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

type ContainerProps = {
  onClose: () => void,
  baseUrl: string,
  projectId: string,
  ownerId: string,
  organizationId: string,
  authorization: string
}

export default PublishApiModalContainer