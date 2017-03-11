import React, {Component} from 'react'
import ReactSVG from 'react-svg'
import mulesoftLogo from '@mulesoft/anypoint-icons/lib/assets/mulesoft-logo.svg'
import designerLogo from '@mulesoft/anypoint-icons/lib/assets/api-designer-color.svg'
import HeaderOptions from './HeaderOptions'
import './Header.css';

class Header extends Component {

  render() {
    const {projectName} = this.props

    return (
      <div className="App-header">
        <div className="Left-header">
          {projectName ?
            <ReactSVG path={designerLogo} style={{ width: 38 }}/> :
            <ReactSVG path={mulesoftLogo} style={{ width: 38, fill: 'white' }}/>
          }
          <h2 data-test-id="Project-Name">{projectName || 'API designer'}</h2>
        </div>
        <HeaderOptions showAdvancedOptions={true}/>
      </div>
    )
  }
}

export default Header
