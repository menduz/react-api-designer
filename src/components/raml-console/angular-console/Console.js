import React, {Component} from 'react'

import '../../../../.tmp/styles/api-console-light-theme.css'
import './Console.css'
import './console-overrides.css'

class Console extends Component {

  componentDidMount() {
    if (!window.angular){
      console.error('Cant render console since angular is not present')
      return
    }

    window.angular.bootstrap(this.angularContainer, ['ramlConsoleApp'])
    this.updateConsole(this.props)
  }

  shouldComponentUpdate(nextProps) {
    if (!window.angular){
      console.error('Cant update console since angular is not present')
      return
    }

    this.updateConsole(nextProps)
    return false
  }

  updateConsole(nextProps) {
    const containerElement = this.angularContainer
    const scope = window.angular.element(containerElement).scope()
    if (scope.raml !== nextProps.raml) {
      console.time("updatingConsole")
      scope.$apply(() => {
        scope.raml = nextProps.raml
        console.timeEnd("updatingConsole")
      })
    }
  }

  render() {
    return (
      <div className="angular-container api-designer-console"
           data-test-id="Raml-Console"
           ref={angularContainer => this.angularContainer = angularContainer}>
        <raml-console raml="raml"
                      options="{singleView: true, disableThemeSwitcher: true, disableRamlClientGenerator: true, disableTitle: true}"/>
      </div>
    )
  }
}

export default Console
