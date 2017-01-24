import React from 'react'
import {connect} from 'react-redux'
import ToggleButton from 'react-toggle-button'
import {createMock, deleteMock} from './actions'
import './Mock.css'

class Mock extends React.Component {
  onToggle(value) {
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
      <div className="Mock">
        <small>Mocking Service:</small>
        <div>
          <ToggleButton
            value={ isUp || false }
            onToggle={this.onToggle.bind(this)}/>
        </div>
      </div>
    )

  }
}

const mapStateToProps = state => {
  const {mock} = state
  if (!mock) return {}

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