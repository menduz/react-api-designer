import React, {Component} from 'react'
import {Preview} from '../preview'
import {Errors} from '../errors'
import {Mock} from '../mock'
import {connect} from 'react-redux'
import './info.css'

class Info extends Component {

  render() {
    const {errors, language} = this.props
    const title = language.id === 'raml' ? 'RAML Documentation' : `${language.label || ''} Preview`
    const numWarnings = errors.filter(error => error.isWarning).length
    const numError = errors.filter(error => !error.isWarning).length
    const showMock = language && language.id !== '' && (language.id === 'raml' || language.id === 'oas')

    return (
      <div className="InfoPanel" data-test-id="Info-Panel">
        <div className="InfoTitle">
          <span className="title-name">{title}</span>
          {showMock ? <Mock/> : null}
        </div>
        {numError > 0 ? <Errors/> : numWarnings > 0 ?
            <div className="warning-preview">
              <Errors/>
              <Preview/>
            </div> : <Preview/>
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {editor} = state
  return {
    errors: editor.errors,
    language: editor.language,
  }
}

export default connect(mapStateToProps)(Info)