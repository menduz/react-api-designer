// @flow

import React, {Component} from 'react'
import Spinner from '@mulesoft/anypoint-components/lib/Spinner'
import {Mock} from '../../mock'
import './Console.css'

class Console extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this._updateConsole(nextProps.raml)
  }

  _updateConsole(raml) {
    if (this.raml !== raml) {
      this.raml = raml
      this.setState({loading: true})

      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        console.time("updatingConsole")
        this.console.raml = {...this.raml}
        console.timeEnd("updatingConsole")
        this.setState({loading: false})
      }, 100)
    }
  }

  render() {
    const {loading} = this.state
    return (
      <div className="Console" data-test-id="Raml-Console">
        <div className="Console-toolbar">
          {loading && <div className="Spinner-console"><Spinner size="s"/></div>}
          <Mock/>
        </div>
        <api-console-raml ref={console => this.console =  console} narrow/>
      </div>
    )
  }
}

export default Console
