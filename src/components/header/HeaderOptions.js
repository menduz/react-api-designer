// @flow

import React, {Component} from 'react'
import {connect} from 'react-redux'
import Spinner from '@mulesoft/anypoint-components/lib/Spinner'
import {hasProjectSelected} from '../../bootstrap/selectors'
import Support from '../menu/support/Support'
import ProjectOptions from '../menu/project-options/ProjectOptions'
import ProjectOptionsBasic from '../menu/project-options/ProjectOptionsBasic'
import publishApi from '../modal/publish-api'
import PublishApiButton from './publish-api-button/PublishApiButton'
import './Header.css';

class HeaderOptions extends Component {

  render() {
    const {
      progress, isExchangeOpen, clearExchangeModal, isExchangeMode, showAdvancedOptions
    } = this.props

    const {PublishApiModalContainer} = publishApi
    return (
      <div className="HeaderOptions">
        <div className="Spinner">{progress ? <Spinner data-test-id="Progress-Spinner" size="s"/> : null}</div>
        <div className="Right-header">
          {isExchangeMode ? <PublishApiButton/> : null}
          {showAdvancedOptions ? <Support/> : null}
          {showAdvancedOptions ? <ProjectOptions/> : <ProjectOptionsBasic/>}
          {isExchangeOpen ?
            <PublishApiModalContainer onClose={() => {}} onCancel={clearExchangeModal.bind(this)}/>
            : null
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const {editor, configuration, publishApi, repository} = state
  return {
    progress: editor.isParsing || repository.progress,
    isExchangeOpen: publishApi.isOpen,
    isExchangeMode: configuration.isExchangeMode && hasProjectSelected(state),
    showAdvancedOptions: ownProps.showAdvancedOptions
  }
}

const mapDispatchToProps = dispatch => {
  return {
    clearExchangeModal: () => dispatch(publishApi.actions.clear())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderOptions)
