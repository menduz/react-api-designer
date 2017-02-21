import React from 'react'
import {connect} from 'react-redux'
import consumeApi from '../../modal/consume-api'
import consumeColorIcon from './assets/ConsumeExchangeColorIcon.svg'
import './DependencyMenu.css'

class DependencyMenu extends React.Component {

  render() {
    const {isConsumeOpen, isConsumeMode, openConsumeModal, clearConsumeModal} = this.props
    const {ConsumeApi} = consumeApi
    return isConsumeMode ? (
      <div className="dependency-menu menu">
        <span className="menu-name">Dependencies</span>

        <div className="dependency-content">
          <a className="consume-menu" onClick={openConsumeModal.bind(this)} data-test-id="Consume-Button">
            <img src={consumeColorIcon} height="20px"/>
          </a>
        </div>
        {isConsumeOpen ? <ConsumeApi onCancel={clearConsumeModal.bind(this)}/> : null}
      </div>
    ) : null
  }
}

const mapStateToProps = state => {
  const {configuration, consumeApi} = state
  return {
    isConsumeOpen: consumeApi.isOpen,
    isConsumeMode: configuration.isConsumeMode
  }
}

const mapDispatchToProps = dispatch => {
  return {
    openConsumeModal: () => dispatch(consumeApi.actions.openModal()),
    clearConsumeModal: () => dispatch(consumeApi.actions.clear())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DependencyMenu)