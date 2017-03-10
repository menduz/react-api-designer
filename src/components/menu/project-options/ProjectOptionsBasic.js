import React, {Component} from 'react'
import {connect} from 'react-redux'

import {actions as configActions} from '../../header/index'
import {getTheme, isConsumeMode, isExchangeMode} from '../../header/selectors'

import ContextMenu from '@mulesoft/anypoint-components/lib/ContextMenu'
import Icon from '@mulesoft/anypoint-icons/lib/Icon'
import supportMenuOptions from '../support/assets/supportOptionsData.json'

class ProjectOptions extends Component {
  render() {
    const {theme} = this.props

    const contextMenuOptions = [
      {
        label: `${theme === 'vs' ? 'Dark' : 'Light'} Editor`,
        onClick: this.props.changeTheme.bind(this, theme === 'vs' ? 'vs-dark' : 'vs')
      },
      ...supportMenuOptions
    ]

    return (
      <ContextMenu className="header-menu" options={contextMenuOptions} testId="Header-Menu">
        <Icon name="contextmenu" size={19} fill={"white"}/>
      </ContextMenu>
    )
  }
}

const mapStateToProps = state => {
  return {
    theme: getTheme(state),
    isConsumeMode: isConsumeMode(state),
    isExchangeMode: isExchangeMode(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeTheme: (theme: string) => dispatch(configActions.changeTheme(theme))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectOptions)
