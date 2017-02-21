import React, {Component} from 'react'
import {connect} from 'react-redux'
import Spinner from '@mulesoft/anypoint-components/lib/Spinner'
import exchangeIcon from './assets/PublishExchangeIcon.svg'
import Icon from '@mulesoft/anypoint-icons/lib/Icon'
import ContextMenu from '@mulesoft/anypoint-components/lib/ContextMenu'
import {actions as configActions} from './index'
import supportMenuOptions from './assets/supportOptionsData.json'
import publishApi from '../modal/publish-api'
import Storage from '../../Storage'

import './Header.css';

class Header extends Component {

  render() {
    const {progress, projectName, theme, isModalOpen, openModal, clearModal, showInfoPanelTabs} = this.props

    const contextMenuOptions = [
      {
        label: `${theme === 'vs' ? 'Dark' : 'Light'} Theme`,
        onClick: this.props.changeTheme.bind(this, theme === 'vs' ? 'vs-dark' : 'vs')
      },
      {
        label: `${showInfoPanelTabs ? 'No tabs' : 'Tabs'} for right Panel`,
        onClick: this.props.changeShowInfoPanelTabs.bind(this, !showInfoPanelTabs)
      }
    ]

    const {PublishApiModalContainer} = publishApi
    return (
      <div className="App-header">
        <div className="Left-header" data-testId="Left-Header">
          {projectName ?
            <Icon name="api-designer-color" size={38}/> :
            <Icon name="mulesoft-logo" size={38} fill={"white"}/>
          }
          <h2>{projectName || 'API designer'}</h2>
        </div>
        <div className="Spinner-parser">{progress ? <Spinner size="s"/> : null}</div>
        <div className="Right-header" data-testId="Right-header">
          <a className="export-menu" onClick={openModal.bind(this)} data-testId="Export-Button">
            <img src={exchangeIcon} height="20px"/>
          </a>
          <span className="Divider"/>
          <ContextMenu className="support-menu" options={supportMenuOptions} testId="Support-Menu">
            <Icon name="support-small" size={19} fill={"white"}/>
          </ContextMenu>
          <ContextMenu className="header-menu" options={contextMenuOptions} testId="Header-Menu">
            <Icon name="contextmenu" size={19} fill={"white"}/>
          </ContextMenu>
        </div>
        {isModalOpen ?
          <PublishApiModalContainer onClose={() => {}}
                                    onCancel={clearModal.bind(this)}
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
  const {editor, repository, configuration, publishApi} = state
  return {
    progress: editor.isParsing || repository.progress,
    theme: configuration.theme,
    showInfoPanelTabs: configuration.showInfoPanelTabs,
    isModalOpen: publishApi.isOpen
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeTheme: (theme: string) => dispatch(configActions.changeTheme(theme)),
    openModal: () => dispatch(publishApi.actions.openModal()),
    clearModal: () => dispatch(publishApi.actions.clear()),
    changeShowInfoPanelTabs: (showTabs: boolean) => dispatch(configActions.showInfoPanelTabs(showTabs))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
