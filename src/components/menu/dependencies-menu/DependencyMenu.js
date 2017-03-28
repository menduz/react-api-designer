import React from 'react'
import {connect} from 'react-redux'
import {isOpen} from '../../modal/consume-api/selectors'
import * as consumeIndex from '../../modal/consume-api'
import consumeColorIcon from './assets/ConsumeExchangeColorIcon.svg'
import './DependencyMenu.css'

class DependencyMenu extends React.Component {

  render() {
    const {isConsumeOpen} = this.props
    const {ConsumeApi} = consumeIndex
    return (
      <div className="dependency-menu menu" data-test-id="Dependencies-Menu">
        <span className="menu-name">Dependencies</span>

        <div className="dependency-content">
          <a className="consume-menu" onClick={this.props.openConsumeModal.bind(this)} data-test-id="Consume-Button">
            <img src={consumeColorIcon} role="presentation" height="20px"/>
          </a>
        </div>
        {isConsumeOpen ? <ConsumeApi onCancel={this.props.clearConsumeModal.bind(this)}/> : null}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    isConsumeOpen: isOpen(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    openConsumeModal: () => dispatch(consumeIndex.actions.openAndPopulate()),
    clearConsumeModal: () => dispatch(consumeIndex.actions.clear())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DependencyMenu)