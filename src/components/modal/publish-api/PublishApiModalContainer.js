// @flow

import React from "react"
import {connect} from 'react-redux'

import {getAll} from './PublishApiSelectors'
import PublishApiModal from './PublishApiModal'

import type {State} from "./PublishApiModel"
import {changeValue, publish, clear, removeTag, addTag, togglePublishBothApis} from "./PublishApiActions"

type ContainerProps = {
  onClose: () => void
}

const mapState = (rootState) => {
  const state: State = getAll(rootState)
  return {
    groupId: state.form['groupId'],
    assetId: state.form['assetId'],
    main: state.form['main'],
    name: state.form['name'],
    version: state.form['version'],
    tag: state.form['tag'],
    tags: [...state.form['tags']],
    isFetching: state.isFetching,
    isFetched: state.isFetched,
    link: state.link,
    error: state.error,
    isLoading: state.isLoading,
    publishToBothApis: state.publishToBothApis,
    publishToExchange: state.publishToExchange
  }
}

const mapDispatch = (dispatch, props: ContainerProps) => {
  return {
    onPublishToBothApis: (publishBoth: boolean) => dispatch(togglePublishBothApis(publishBoth)),
    onTagChange: (tag: string) => dispatch(changeValue('tag', tag)),
    onTagRemove: (tag: string) => dispatch(removeTag(tag)),
    onSubmitTag: (tag: string) => dispatch(addTag(tag)),
    onNameChange: (name: string) => dispatch(changeValue('name', name)),
    onVersionChange: (version: string) => dispatch(changeValue('version', version)),
    onAssetIdChange: (assetId: string) => dispatch(changeValue('assetId', assetId)),
    onGroupIdChange: (groupId: string) => dispatch(changeValue('groupId', groupId)),
    onMainFileChange: (main: string) => dispatch(changeValue('main', main)),
    onSubmit: (name: string, version: string, tags: Array<string>, main: string, assetId: string, groupId: string,
               platform: boolean, exchange: boolean) =>
      dispatch(publish(name, version, tags, main, assetId, groupId, platform, exchange)),
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

export default connect(mapState, mapDispatch)(PublishApiModal)