import React, {Component} from 'react'
import {connect} from 'react-redux'

import {actions as configActions} from '../../header/index'

import ContextMenu from '@mulesoft/anypoint-components/lib/ContextMenu'
import Icon from '@mulesoft/anypoint-icons/lib/Icon'

class ProjectOptions extends Component {
  render() {
    const {isExchangeMode, theme, publishToExchange} = this.props

    const contextMenuOptions = [
      {
        label: `${theme === 'vs' ? 'Dark' : 'Light'} Editor`,
        onClick: this.props.changeTheme.bind(this, theme === 'vs' ? 'vs-dark' : 'vs')
      }, {
        label: `${isExchangeMode ? 'Disable' : 'Enable'} Exchange Mode`,
        onClick: this.props.toggleExchangeMode.bind(this, !isExchangeMode)
      }, {
        label: `${publishToExchange ? 'Disable' : 'Enable'} Publish to Exchange`,
        onClick: this.props.togglePublishExchange.bind(this, !publishToExchange)
      }
    ]

    return (
      <ContextMenu className="header-menu" options={contextMenuOptions} testId="Header-Menu">
        <Icon name="contextmenu" size={19} fill={"white"}/>
      </ContextMenu>
    )
  }
}

const mapStateToProps = state => {
  const {configuration} = state
  return {
    theme: configuration.theme,
    isExchangeMode: configuration.isExchangeMode,
    publishToExchange: configuration.publishToExchange
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeTheme: (theme: string) => dispatch(configActions.changeTheme(theme)),
    toggleExchangeMode: (changeMode: boolean) => dispatch(configActions.changeExchangeMode(changeMode)),
    togglePublishExchange: (changeMode: boolean) => dispatch(configActions.changePublishExchange(changeMode))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectOptions)
