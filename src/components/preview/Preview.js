// @flow
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {ConsoleLoader} from '../raml-console/angular-console'
import JSONTree from 'react-json-tree'
import ReactMarkdown from 'react-markdown'
import {getCurrentFileContent} from "../../repository-redux/selectors"
import {getLanguage, getParsedObject} from "../editor/selectors"
import './Preview.css'

class Preview extends Component {

  constructor(props) {
    super(props)
    const consoleUrl = window.require.getConfig().paths['console']
    this.consoleWrapper = ConsoleLoader.load(consoleUrl)
  }

  static _theme = {
    scheme: 'monokai',
    author: 'Juan Longo',
    base03: '#bbbbbb',
    base09: '#09885a',
    base0B: '#0451b9',
    base0D: '#a31515',
  }

  static _empty() {
    return <div className="No-preview" data-test-id="No-Preview">No preview</div>
  }

  _render() {
    const {parsedObject, language, text, show} = this.props
    if (!show) return Preview._empty()

    const ConsoleWrapper = this.consoleWrapper
    switch (language.id) {
      case 'raml':
      case 'oas':
        return !parsedObject ? Preview._empty() :
          <ConsoleWrapper raml={parsedObject}/>
      case 'json':
        return !parsedObject ? Preview._empty() :
          <div className="json-preview"><JSONTree data={parsedObject} theme={Preview._theme} hideRoot={true} invertTheme={false}/></div>
      case 'md':
        return !text ? Preview._empty() :
          <ReactMarkdown source={text} className="md-preview"/>
      default:
        return Preview._empty()
    }
  }

  render() {
    return <div className="Preview" data-test-id="Preview">{this._render()}</div>
  }
}

const mapStateToProps = (state) => {
  const text = getCurrentFileContent(state)()
  return {
    text,
    parsedObject: getParsedObject(state),
    language: getLanguage(state)
  }
}

export default connect(mapStateToProps)(Preview)
