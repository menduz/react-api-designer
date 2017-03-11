import React, {Component} from 'react'
import ReactSVG from 'react-svg'
import supportIcon from '@mulesoft/anypoint-icons/lib/assets/support-small.svg'

class Support extends Component {
  render() {
    return (
      <a href="https://docs.mulesoft.com/api-manager/designing-your-api" target="_blank">
        <ReactSVG path={supportIcon} style={{ width: 19, fill: 'white' }}/>
      </a>
    )
  }
}

export default Support
