import React, {Component} from 'react'
import Icon from '../../svgicon/SvgIcon'

class Support extends Component {
  render() {
    return (
      <a href="https://docs.mulesoft.com/api-manager/designing-your-api" target="_blank">
        <Icon name="support-small" size={19} fill="white" />
      </a>
    )
  }
}

export default Support
