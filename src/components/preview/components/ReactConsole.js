//@flow
import React, {Component} from 'react'
import './ReactConsole.css'

class ReactConsole extends Component {

  shouldComponentUpdate(nextProps) {
    const {raml} = nextProps
    this._setRamlToConsole(raml)
    return false
  }

  _setRamlToConsole(raml) {
    const ramlSource = raml.specification !== undefined ? raml.specification : raml
    const ramlCopy = {}
    Object.assign(ramlCopy, ramlSource)
    this.console.raml = ramlCopy
  }

  //Warning setting state here will trigger re-render
  componentDidMount() {
    const {raml} = this.props
    this._setRamlToConsole(raml)
  }

  render() {
    return (
      <api-console-raml ref={console => this.console = console } narrow/>
    )
  }
}

export default ReactConsole
