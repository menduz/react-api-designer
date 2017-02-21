import React, {Component} from 'react'
import Spinner from '@mulesoft/anypoint-components/lib/Spinner'
import {Mock} from '../../mock'
import './Console.css'
import './console-overrides.css'

class Console extends Component {

  componentDidMount() {
    window.angular.bootstrap(this.angularContainer, ['ramlConsoleApp'])
    this.updateConsole(this.props)
  }

  shouldComponentUpdate(nextProps) {
    this.updateConsole(nextProps)
    return false
  }

  updateConsole(nextProps) {
    const containerElement = this.angularContainer
    const scope = window.angular.element(containerElement).scope()
    if (scope.raml !== nextProps.raml) {
      this.spinner.classList.remove("hide")
      console.time("updatingConsole")
      scope.$apply(() => {
        scope.raml = nextProps.raml
        console.timeEnd("updatingConsole")
        this.spinner.classList.add("hide")
      })
    }
  }

  render() {
    return (
      <div className="angular-container"
           data-test-id="Raml-Console"
           ref={angularContainer => this.angularContainer = angularContainer}>
        <div className="Console-toolbar">
          <div className="Spinner-console hide" ref={spinner => this.spinner = spinner}>
            <Spinner size="s"/>
          </div>
          <Mock/>
        </div>
        <raml-console raml="raml"
                      options="{singleView: true, disableThemeSwitcher: true, disableRamlClientGenerator: true, disableTitle: true}"/>
      </div>
    )
  }
}

export default Console
