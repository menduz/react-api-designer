//@flow
import React, {Component} from 'react'
import './ReactConsole.css'
import {Mock} from '../mock'

class ReactConsole extends Component {

  shouldComponentUpdate(nextProps) {
    const {raml} = nextProps
    this._setRamlToConsole(raml)
    return false
  }


  componentDidMount() {
    const {raml} = this.props
    this._setRamlToConsole(raml)
  }

  _setRamlToConsole(raml) {
    console.time("rendering-console")
    const ramlCopy = {}
    Object.assign(ramlCopy, raml)
    this.console.raml = ramlCopy
    console.timeEnd("rendering-console")
  }

  render() {
    return (
      <div className="Console">
        <div className="Mock-on-off">
          <small>Mocking Service:</small>
          <Mock/>
        </div>
        <api-console-raml ref={console => this.console = console } narrow/>
      </div>
    )
  }
}

export default ReactConsole
