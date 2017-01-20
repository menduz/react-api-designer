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

  _setRamlToConsole(raml) {
    const ramlCopy = {}
    Object.assign(ramlCopy, raml)
    this.console.raml = ramlCopy
  }

  //Warning setting state here will trigger re-render
  componentDidMount() {
    const {raml} = this.props
    this._setRamlToConsole(raml)
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
