import React, {Component} from 'react'
import {connect} from 'react-redux'
import ReactSVG from 'react-svg'
import contestIcon from '@mulesoft/anypoint-icons/lib/assets/contextmenu.svg'

import {hasProjectSelected} from '../../../bootstrap/selectors'
import {getTheme, isExchangeMode, getPublishToExchange} from '../../header/selectors'
import {actions as configActions} from '../../header/index'
import supportMenuOptions from '../support/assets/supportOptionsData.json'

import ContextMenu from '@mulesoft/anypoint-components/lib/ContextMenu'

class ProjectOptions extends Component {
  render() {
    const {isExchangeMode, publishToExchange, hasProjectSelected} = this.props

    const contextMenuOptions = supportMenuOptions.slice(1)
    // const contextMenuOptions = [
    //   // {
    //   //   label: `${theme === 'vs' ? 'Dark' : 'Light'} Editor`,
    //   //   onClick: this.props.changeTheme.bind(this, theme === 'vs' ? 'vs-dark' : 'vs')
    //   // },
    //   ...supportMenuOptions.slice(1)
    // ]

    if (hasProjectSelected) {
      contextMenuOptions.push({
        label: `${isExchangeMode ? 'Disable' : 'Enable'} Exchange Mode`,
        onClick: this.props.toggleExchangeMode.bind(this, !isExchangeMode)
      })

      contextMenuOptions.push({
        label: `${publishToExchange ? 'Disable' : 'Enable'} Publish to Exchange`,
        onClick: this.props.togglePublishExchange.bind(this, !publishToExchange)
      })
    }

    return (
      <ContextMenu className="header-menu" options={contextMenuOptions} testId="Header-Menu">
        <ReactSVG path={contestIcon} style={{ width: 19, fill: 'white' }}/>
      </ContextMenu>
    )
  }
}

const mapStateToProps = state => {
  return {
    theme: getTheme(state),
    isExchangeMode: isExchangeMode(state),
    publishToExchange: getPublishToExchange(state),
    hasProjectSelected: hasProjectSelected(state)
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
