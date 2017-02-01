// @flow

import React, {Component} from 'react'
import {connect} from 'react-redux'
import Spinner from '@mulesoft/anypoint-components/lib/Spinner'
import exchangeIcon from './assets/PublishExchangeIcon.svg'
import Icon from '@mulesoft/anypoint-icons/lib/Icon'
import './Header.css';

class Header extends Component {

  render() {
    const {isParsing, projectName} = this.props
    return (
      <div className="App-header">
        <div className="Left-header">
          <Icon name="api-designer-color" size={38}/>
          <h2>{projectName ? projectName : 'API designer'}</h2>
        </div>
        <div className="Spinner-parser">{isParsing ? <Spinner size="s"/> : null}</div>
        <div className="Right-header">
          <a><img src={exchangeIcon} height="20px"/></a>
          <span className="Divider"/>
          <Icon name="support-small" size={19} fill={"white"}/>
          <Icon name="contextmenu" size={19} fill={"white"}/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {editor} = state
  return {
    isParsing: editor.isParsing
  }
}

export default connect(mapStateToProps)(Header)
