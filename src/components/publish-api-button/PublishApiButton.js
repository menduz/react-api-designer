import React, {Component} from 'react'
import {connect} from 'react-redux'

import exchangeIcon from './assets/PublishExchangeIcon.svg'
import publishApi from '../modal/publish-api'

class PublishApiButton extends Component {
  render() {
    const {openExchangeModal} = this.props

    return (
      <a className="export-menu"
         key="export-menu"
         onClick={openExchangeModal.bind(this)}
         data-test-id="Export-Button">
        <img src={exchangeIcon} role="presentation" height="20px"/>
      </a>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    openExchangeModal: () => dispatch(publishApi.actions.openModal())
  }
}

export default connect(null, mapDispatchToProps)(PublishApiButton)