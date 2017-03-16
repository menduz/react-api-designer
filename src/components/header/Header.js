import React, {Component} from 'react'
import Icon from '../icon/Icon'
import HeaderOptions from './HeaderOptions'
import './Header.css';

class Header extends Component {

  render() {
    const {projectName} = this.props

    return (
      <div className="App-header">
        <div className="Left-header">
          {projectName ?
            <Icon name="api-designer-color" size={38}/> :
            <Icon name="mulesoft-logo" size={38} fill="white"/>
          }

          <h2 data-test-id="Project-Name">{projectName || 'API designer'}</h2>
        </div>
        <HeaderOptions showAdvancedOptions={true}/>
      </div>
    )
  }
}

export default Header
