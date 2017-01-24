//@flow

import React, {Component} from 'react'
import {connect} from 'react-redux'
import Spinner from '@mulesoft/anypoint-components/lib/Spinner'
import './Header.css';

class Header extends Component {

  render() {
    const {isParsing} = this.props
    return (
      <div className="App-header">
        <h2>Api Designer</h2>
        {isParsing ? <div className="Spinner-parser"><Spinner size="s"/></div> : null}
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {editor} = state
  return {
    isParsing: editor.isParsing
  }
}

export default connect(mapStateToProps)(Header)
