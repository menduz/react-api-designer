import React, {Component} from 'react'
import {connect} from 'react-redux'
import cx from 'classnames'
import {getLanguage} from "../../editor/selectors"
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
    const {language} = this.props
    return (
      <div data-test-id="Raml-Console"
           className={cx('angular-container', 'api-designer-console', {'hide-resources': language.type === 'Library'})}
           ref={angularContainer => this.angularContainer = angularContainer}>
        <raml-console raml="raml"
                      options="{singleView: true, disableThemeSwitcher: true, disableRamlClientGenerator: true, disableTitle: true}"/>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    raml: ownProps.raml,
    language: getLanguage(state)
  }
}

export default connect(mapStateToProps)(Console)
