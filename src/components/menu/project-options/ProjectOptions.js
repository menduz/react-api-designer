import React, {Component} from 'react'
import {connect} from 'react-redux'

import {actions as configActions} from '../../header/index'

import ContextMenu from '@mulesoft/anypoint-components/lib/ContextMenu'
import Icon from '@mulesoft/anypoint-icons/lib/Icon'

class ProjectOptions extends Component {
  render() {
    const {
      showInfoPanelTabs,
      isConsumeMode,
      isExchangeMode,
      theme
    } = this.props

    const contextMenuOptions = [
      {
        label: `${theme === 'vs' ? 'Dark' : 'Light'} Editor`,
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
    showInfoPanelTabs: configuration.showInfoPanelTabs,
    isConsumeMode: configuration.isConsumeMode,
    isExchangeMode: configuration.isExchangeMode
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeTheme: (theme: string) => dispatch(configActions.changeTheme(theme)),
    changeShowInfoPanelTabs: (showTabs: boolean) => dispatch(configActions.showInfoPanelTabs(showTabs)),
    toggleConsumeMode: (changeMode: boolean) => dispatch(configActions.changeConsumeMode(changeMode)),
    toggleExchangeMode: (changeMode: boolean) => dispatch(configActions.changeExchangeMode(changeMode))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectOptions)
