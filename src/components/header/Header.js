// @flow

import React, {Component} from 'react'
import {connect} from 'react-redux'
import Spinner from '@mulesoft/anypoint-components/lib/Spinner'
import Icon from '@mulesoft/anypoint-icons/lib/Icon'
import Support from '../menu/support/Support'
import ProjectOptions from '../menu/project-options/ProjectOptions'
import publishApi from '../modal/publish-api'
import PublishApiButton from '../publish-api-button/PublishApiButton'
import './Header.css';

class Header extends Component {

  render() {
    const {
      progress, projectName, isExchangeOpen, clearExchangeModal, isExchangeMode
    } = this.props

    const {PublishApiModalContainer} = publishApi
    return (
      <div className="App-header">
        <div className="Left-header">
          {projectName ?
            <Icon name="api-designer-color" size={38}/> :
            <Icon name="mulesoft-logo" size={38} fill={"white"}/>
          }
          <h2 data-test-id="Project-Name">{projectName || 'API designer'}</h2>
        </div>
        <div className="Spinner-parser">{progress ? <Spinner data-test-id="Progress-Spinner" size="s"/> : null}</div>
        <div className="Right-header">
          {isExchangeMode ? [
              <PublishApiButton/>,
              <svg data-test-id="Divider" className="divider" key="divider" height="30" width="20">
                <line x1="10" y1="0" x2="10" y2="30"/>
              </svg>
            ] : null
          }
          <Support/>
          <ProjectOptions/>
        </div>
        {isExchangeOpen ?
          <PublishApiModalContainer onClose={() => {}}
                                    onCancel={clearExchangeModal.bind(this)}/>
          : null
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {editor, configuration, publishApi, repository} = state
  return {
    progress: editor.isParsing || repository.progress,
    isExchangeOpen: publishApi.isOpen,
    isExchangeMode: configuration.isExchangeMode
  }
}

const mapDispatchToProps = dispatch => {
  return {
    clearExchangeModal: () => dispatch(publishApi.actions.clear())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
