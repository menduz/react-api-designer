import React, {Component} from 'react'
import {Preview} from '../preview'
import {Errors} from '../errors'
import {Mock} from '../mock'
import {getLanguage, getErrors} from "../editor/selectors"
import {connect} from 'react-redux'
import './info.css'

class Info extends Component {

  static showMock(language) {
    const validLanguage = language && language.id !== '' && (language.id === 'raml' || language.id === 'oas')

    const t = language.type
    const validLanguageType = t && (t === '1.0' || t === '0.8' || t === 'Overlay' || t === 'Extension')

    return validLanguage && validLanguageType
  }

  static title(language) {
    if (language.id === 'raml') {
      return 'RAML ' + (language.type === 'Library' ? 'Library' : 'Documentation')
    }

    return `${language.label || ''} Preview`
  }

  render() {
    const {errors, language} = this.props
    const numWarnings = errors.filter(error => error.isWarning).length
    const numError = errors.filter(error => !error.isWarning).length
    const showMock = Info.showMock(language)

    return (
      <div className="InfoPanel" data-test-id="Info-Panel">
        <div className="InfoTitle">
          <span className="title-name">{Info.title(language)}</span>
          {showMock ? <Mock/> : null}
        </div>
        {numError > 0 ? <Errors/> : numWarnings > 0 ?
            <div className="warning-preview">
              <Errors/>
              <Preview/>
            </div> :
          <Preview/>
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    errors: getErrors(state),
    language: getLanguage(state)
  }
}

export default connect(mapStateToProps)(Info)