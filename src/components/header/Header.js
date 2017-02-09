// @flow

import React, {Component} from 'react'
import {connect} from 'react-redux'
import Spinner from '@mulesoft/anypoint-components/lib/Spinner'
import exchangeIcon from './assets/PublishExchangeIcon.svg'
import Icon from '@mulesoft/anypoint-icons/lib/Icon'
import ContextMenu from '@mulesoft/anypoint-components/lib/ContextMenu'
import {actions as configActions} from './index'
import supportMenuOptions from './assets/supportOptionsData.json'
import './Header.css';

class Header extends Component {

  render() {
    const {isParsing, projectName, theme} = this.props

    const contextMenuOptions = [{
      label: `${theme === 'vs' ? 'Dark' : 'Light'} Theme`,
      onClick: this.props.changeTheme.bind(this, theme === 'vs' ? 'vs-dark' : 'vs')
    }]

    const exportMenuOptions = [1, 2, 3].map(index => {
      return {label: `Example ${index}`, href: "https://www.google.com", target: "_blank"}
    })

    return (
      <div className="App-header">
        <div className="Left-header">
          {projectName ?
            <Icon name="api-designer-color" size={38}/> :
            <Icon name="mulesoft-logo" size={38} fill={"white"}/>
          }
          <h2>{projectName || 'API designer'}</h2>
        </div>
        <div className="Spinner-parser">{isParsing ? <Spinner size="s"/> : null}</div>
        <div className="Right-header">
          <ContextMenu className="export-menu" options={exportMenuOptions}>
            <img src={exchangeIcon} height="20px"/>
          </ContextMenu>
          <span className="Divider"/>
          <ContextMenu className="support-menu" options={supportMenuOptions}>
            <Icon name="support-small" size={19} fill={"white"}/>
          </ContextMenu>
          <ContextMenu className="header-menu" options={contextMenuOptions}>
            <Icon name="contextmenu" size={19} fill={"white"}/>
          </ContextMenu>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {editor, configuration} = state
  return {
    isParsing: editor.isParsing,
    theme: configuration.theme,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeTheme: (theme: string) => dispatch(configActions.changeTheme(theme))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
