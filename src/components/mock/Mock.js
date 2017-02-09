import React from 'react'
import {connect} from 'react-redux'
import ToggleButton from 'react-toggle-button'
import {createMock, deleteMock, updateMock} from './actions'
import {getCurrentFilePath} from '../editor/selectors'
import './Mock.css'

class Mock extends React.Component {

  shouldComponentUpdate(nextProps) {
    if (nextProps.parsedObject !== this.props.parsedObject) this.props.shouldUpdateMock()
    return nextProps.isUp !== this.props.isUp
  }

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
      <div className="Mock" data-testId="Mock">
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
  const {mock, editor} = state
  const file = getCurrentFilePath(state).toString()
  if (!mock || !file ) return {}
  const m = mock.find(c => c.file === file)
  if (!m) return {}
  return {
    isUp: m.isUp,
    parsedObject: editor.parsedObject
  }
}

const mapDispatch = dispatch => {
  return {
    startMock: () => dispatch(createMock()),
    stopMock: () => dispatch(deleteMock()),
    shouldUpdateMock: () => dispatch(updateMock())
  }
}

export default connect(mapStateToProps, mapDispatch)(Mock)