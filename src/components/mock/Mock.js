import React from 'react'
import {connect} from 'react-redux'
import ToggleButton from 'react-toggle-button'

import {createMock, deleteMock} from './actions'

class Mock extends React.Component {
  onToggle(value) {
    console.log('onToggle ' + value)
    if (value)
      this.props.stopMock()
    else
      this.props.startMock()

  }

  render() {
    const {
      isUp
    } = this.props
    return (
      <div>
        <ToggleButton
          value={ isUp || false }
          onToggle={this.onToggle.bind(this)} />
      </div>
    )

  }
}

const mapStateToProps = state => {
  const {mock} = state
  if(!mock) return {}

  return {
    isUp: mock.isUp
  }
}

const mapDispatch = dispatch => {
  return {
    startMock: () => dispatch(createMock()),
    stopMock: () => dispatch(deleteMock())
  }
}

export default connect(mapStateToProps, mapDispatch)(Mock)