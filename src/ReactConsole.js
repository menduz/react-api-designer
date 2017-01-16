//@flow
import React, {Component} from 'react'
import './App.css'

class ReactConsole extends Component {

  shouldComponentUpdate(nextProps) {
    const {raml} = nextProps
    this.console.raml = raml
    return false
  }

  render() {
    return (
      <api-console-raml ref={console => this.console = console } raml={this.props.raml} narrow/>
    )
  }
}

export default ReactConsole
