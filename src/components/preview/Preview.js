//@flow
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Console as AngularConsole} from '../raml-console/angular-console'
import JSONTree from 'react-json-tree'
import ReactMarkdown from 'react-markdown'
import {getCurrentFileContent} from "../../repository-redux/selectors"
import './Preview.css'

class Preview extends Component {

  static _theme = {
    scheme: 'monokai',
    author: 'Juan Longo',
    base03: '#bbbbbb',
    base09: '#09885a',
    base0B: '#0451b9',
    base0D: '#a31515',
  }

  static _consolePreview(language, parsedObject) {
    return parsedObject && language.type &&
      (language.type === '1.0' || language.type === '0.8' ||
      language.type === 'Library' || language.type === 'Overlay' || language.type === 'Extension');
  }

  static _empty() {
    return <div className="No-preview">No preview</div>
  }

  _render() {
    const {parsedObject, language, text} = this.props

    switch (language.id) {
      case 'oas':
      case 'raml':
        return !Preview._consolePreview(language, parsedObject) ? Preview._empty() :
          <AngularConsole raml={parsedObject}/>;
      case 'md':
        return !text ? Preview._empty() :
          <ReactMarkdown source={text} className="md-preview"/>;
      default:
        return !parsedObject ? Preview._empty() :
          <JSONTree data={parsedObject} theme={Preview._theme} hideRoot={true} invertTheme={false}/>;
    }
  }

  render() {
    return <div className="Preview">{this._render()}</div>
  }
}

const mapStateToProps = state => {
  const {editor} = state
  const text = getCurrentFileContent(state)()
  return {
    text,
    parsedObject: editor.parsedObject,
    language: editor.language
  }
}

export default connect(mapStateToProps)(Preview)
