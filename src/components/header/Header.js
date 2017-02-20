// @flow

import React, {Component} from 'react'
import {connect} from 'react-redux'
import Spinner from '@mulesoft/anypoint-components/lib/Spinner'
import exchangeIcon from './assets/PublishExchangeIcon.svg'
import consumeIcon from './assets/ConsumeExchangeIcon.svg'
import Icon from '@mulesoft/anypoint-icons/lib/Icon'
import ContextMenu from '@mulesoft/anypoint-components/lib/ContextMenu'
import {actions as configActions} from './index'
import supportMenuOptions from './assets/supportOptionsData.json'
import publishApi from '../modal/publish-api'
import Storage from '../../Storage'
import consumeApi from '../modal/consume-api'

import './Header.css';

class Header extends Component {

  render() {
    const {
      isParsing, projectName, theme, isExchangeOpen, isConsumeOpen, openConsumeModal,
      openExchangeModal, clearExchangeModal, clearConsumeModal, showInfoPanelTabs, isAnyPointMode
    } = this.props

    const contextMenuOptions = [
      {
        label: `${theme === 'vs' ? 'Dark' : 'Light'} Theme`,
        onClick: this.props.changeTheme.bind(this, theme === 'vs' ? 'vs-dark' : 'vs')
      }, {
        label: `${showInfoPanelTabs ? 'No tabs' : 'Tabs'} for right Panel`,
        onClick: this.props.changeShowInfoPanelTabs.bind(this, !showInfoPanelTabs)
      }, {
        label: `${isAnyPointMode ? 'Standalone' : 'Anypoint'} Mode`,
        onClick: this.props.toggleAnyPointMode.bind(this, !isAnyPointMode)
      }
    ]

    const {PublishApiModalContainer} = publishApi
    const {ConsumeApi} = consumeApi
    return (
      <div className="App-header">
        <div className="Left-header" data-testId="Left-Header">
          {projectName ?
            <Icon name="api-designer-color" size={38}/> :
            <Icon name="mulesoft-logo" size={38} fill={"white"}/>
          }
          <h2>{projectName || 'API designer'}</h2>
        </div>
        <div className="Spinner-parser">{isParsing ? <Spinner size="s"/> : null}</div>
        <div className="Right-header" data-testId="Right-header">
          {isAnyPointMode ? [
              <a className="consume-menu"
                 key="consume-menu"
                 onClick={openConsumeModal.bind(this)}
                 data-testId="Consume-Button">
                <img src={consumeIcon} height="20px"/>
              </a>,
              <a className="export-menu"
                 key="export-menu"
                 onClick={openExchangeModal.bind(this)}
                 data-testId="Export-Button">
                <img src={exchangeIcon} height="20px"/>
              </a>,
              <svg className="divider" key="divider" height="30" width="20">
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
        {isConsumeOpen ? <ConsumeApi onCancel={clearConsumeModal.bind(this)}/> : null}
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {editor, configuration, publishApi, consumeApi} = state
  return {
    isParsing: editor.isParsing,
    theme: configuration.theme,
    showInfoPanelTabs: configuration.showInfoPanelTabs,
    isExchangeOpen: publishApi.isOpen,
    isConsumeOpen: consumeApi.isOpen,
    isAnyPointMode: configuration.isAnyPointMode
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeTheme: (theme: string) => dispatch(configActions.changeTheme(theme)),
    openExchangeModal: () => dispatch(publishApi.actions.openModal()),
    openConsumeModal: () => dispatch(consumeApi.actions.openModal()),
    clearExchangeModal: () => dispatch(publishApi.actions.clear()),
    clearConsumeModal: () => dispatch(consumeApi.actions.clear()),
    changeShowInfoPanelTabs: (showTabs: boolean) => dispatch(configActions.showInfoPanelTabs(showTabs)),
    toggleAnyPointMode: (changeMode: boolean) => dispatch(configActions.changeAnyPointMode(changeMode))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
