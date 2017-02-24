import React, {Component} from 'react'
import {connect} from 'react-redux'

import supportMenuOptions from './assets/supportOptionsData.json'
import ContextMenu from '@mulesoft/anypoint-components/lib/ContextMenu'
import Icon from '@mulesoft/anypoint-icons/lib/Icon'

class Support extends Component {
  render() {
    return (
      <ContextMenu className="support-menu" options={supportMenuOptions} testId="Support-Menu">
        <Icon name="support-small" size={19} fill={"white"}/>
      </ContextMenu>
    )
  }
}

export default connect()(Support)
