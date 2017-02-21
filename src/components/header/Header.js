// @flow

import React, {Component} from 'react'
import {connect} from 'react-redux'
import exchangeIcon from './assets/PublishExchangeIcon.svg'
import Spinner from '@mulesoft/anypoint-components/lib/Spinner'
import Icon from '@mulesoft/anypoint-icons/lib/Icon'
import ContextMenu from '@mulesoft/anypoint-components/lib/ContextMenu'
import {actions as configActions} from './index'
import supportMenuOptions from './assets/supportOptionsData.json'
import publishApi from '../modal/publish-api'
import Storage from '../../Storage'
import './Header.css';

class Header extends Component {

  render() {
    const {
      progress, projectName, theme, isExchangeOpen, openExchangeModal, clearExchangeModal,
      showInfoPanelTabs, isConsumeMode, isExchangeMode
    } = this.props

    const contextMenuOptions = [
      {
        label: `${theme === 'vs' ? 'Dark' : 'Light'} Theme`,
        onClick: this.props.changeTheme.bind(this, theme === 'vs' ? 'vs-dark' : 'vs')
      }, {
        label: `${showInfoPanelTabs ? 'No tabs' : 'Tabs'} for right Panel`,
        onClick: this.props.changeShowInfoPanelTabs.bind(this, !showInfoPanelTabs)
      }, {
        label: `${isConsumeMode ? 'Disable' : 'Enable'} Consume Mode`,
        onClick: this.props.toggleConsumeMode.bind(this, !isConsumeMode)
      }, {
        label: `${isExchangeMode ? 'Disable' : 'Enable'} Exchange Mode`,
        onClick: this.props.toggleExchangeMode.bind(this, !isExchangeMode)
      }
    ]

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
              <a className="export-menu"
                 key="export-menu"
                 onClick={openExchangeModal.bind(this)}
                 data-test-id="Export-Button">
                <img src={exchangeIcon} role="presentation" height="20px"/>
              </a>,
              <svg data-test-id="Divider" className="divider" key="divider" height="30" width="20">
                <line x1="10" y1="0" x2="10" y2="30"/>
              </svg>
            ] : null
          }
          <ContextMenu className="support-menu" options={supportMenuOptions} testId="Support-Menu">
            <Icon name="support-small" size={19} fill={"white"}/>
          </ContextMenu>
          <ContextMenu className="header-menu" options={contextMenuOptions} testId="Header-Menu">
            <Icon name="contextmenu" size={19} fill={"white"}/>
          </ContextMenu>
        </div>
        {isExchangeOpen ?
          <PublishApiModalContainer onClose={() => {}}
                                    onCancel={clearExchangeModal.bind(this)}
                                    baseUrl={Storage.getValue('baseUrl', '')}
                                    ownerId={Storage.getValue('ownerId', '')}
                                    organizationId={Storage.getValue('organizationId', '')}
                                    projectId={Storage.getValue('projectId', '')}/>
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
    theme: configuration.theme,
    showInfoPanelTabs: configuration.showInfoPanelTabs,
    isExchangeOpen: publishApi.isOpen,
    isConsumeMode: configuration.isConsumeMode,
    isExchangeMode: configuration.isExchangeMode
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeTheme: (theme: string) => dispatch(configActions.changeTheme(theme)),
    openExchangeModal: () => dispatch(publishApi.actions.openModal()),
    clearExchangeModal: () => dispatch(publishApi.actions.clear()),
    changeShowInfoPanelTabs: (showTabs: boolean) => dispatch(configActions.showInfoPanelTabs(showTabs)),
    toggleConsumeMode: (changeMode: boolean) => dispatch(configActions.changeConsumeMode(changeMode)),
    toggleExchangeMode: (changeMode: boolean) => dispatch(configActions.changeExchangeMode(changeMode))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
