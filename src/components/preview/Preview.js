//@flow
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Console as AngularConsole} from '../raml-console/angular-console'
import JSONTree from 'react-json-tree'
import ReactMarkdown from 'react-markdown'
import {getFileContent} from "../../repository-redux/selectors"
import './Preview.css'

class Preview extends Component {

  static _empty() {
    return <div className="No-preview">No preview</div>
  }

  _render() {
    const {parsedObject, language, text} = this.props

    switch (language.id) {
      case 'oas':
      case 'raml':
        return !parsedObject ? Preview._empty() : <AngularConsole raml={parsedObject}/>;
      case 'md':
        return !text ? Preview._empty() : <ReactMarkdown source={text}/>;
      default:
        return !parsedObject ? Preview._empty() :
          <JSONTree data={parsedObject} hideRoot={true} shouldExpandNode={(keyName, data, level) => level < 3}/>;
    }
  }

  render() {
    return <div className="Preview">{this._render()}</div>
  }
}

const mapStateToProps = state => {
  const {editor} = state
  const text = editor.path ? getFileContent(state)(editor.path) || '' : ''
  return {
    text: text,
    parsedObject: editor.parsedObject,
    language: editor.language
  }
}

export default connect(mapStateToProps)(Preview)
