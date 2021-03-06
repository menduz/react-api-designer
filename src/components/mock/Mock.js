import React from 'react'
import {connect} from 'react-redux'
import ToggleButton from 'react-toggle-button'
import {createMock, deleteMock, updateMock} from './actions'
import {getCurrentFilePath, getParsedObject} from '../editor/selectors'
import {getAll} from './selectors'
import Spinner from '@mulesoft/anypoint-components/lib/Spinner'
import './Mock.css'

class Mock extends React.Component {

  shouldComponentUpdate(nextProps) {
    if (nextProps.parsedObject !== this.props.parsedObject && nextProps.parsedObject !== null) this.props.shouldUpdateMock()
    return nextProps.isUp !== this.props.isUp || nextProps.isStarting !== this.props.isStarting
  }

  onToggle(value) {
    if (value)
      this.props.stopMock()
    else
      this.props.startMock()
  }

  render() {
    const {isUp, isStarting} = this.props
    return (
      <div className="Mock" data-test-id="Mock">
        <small>Mocking Service</small>
        <div>
          {!isStarting ?
            <ToggleButton
              value={ isUp || false }
              onToggle={this.onToggle.bind(this)}
              colors={{ active: { base: '#30AB5D' }, inactive: { base: '#fff' } }}
              trackStyle={{border:'1px #C4C7C4 solid'}}
              activeLabelStyle={{fontSize: '9px', paddingLeft: '4px'}}
              inactiveLabelStyle={{fontSize: '9px', paddingRight: '11px', color:'#C4C7C4'}}
              thumbStyle={{border:'1px #C4C7C4 solid', boxShadow:''}}/> :
            <Spinner size="s"/>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const mock = getAll(state)
  const path = getCurrentFilePath(state)
  if (!mock || !path) return {}

  const filePath = path.toString()
  const m = mock.find(c => c.file === filePath)
  if (!m) return {}

  return {
    isUp: m.isUp,
    parsedObject: getParsedObject(state),
    isStarting: m.isStarting
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