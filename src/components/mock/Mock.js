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
        <small>Mocking Service</small>
        <div>
          <ToggleButton
            value={ isUp || false }
            onToggle={this.onToggle.bind(this)}
            colors={{ active: { base: '#30AB5D' }, inactive: { base: '#fff' } }}
            trackStyle={{border:'1px #C4C7C4 solid'}}
            activeLabelStyle={{fontSize: '9px', paddingLeft: '4px'}}
            inactiveLabelStyle={{fontSize: '9px', paddingRight: '11px', color:'#C4C7C4'}}
            thumbStyle={{border:'1px #C4C7C4 solid', boxShadow:''}}/>
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