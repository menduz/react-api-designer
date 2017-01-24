//@flow
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {ReactConsole} from '../console'
import JSONTree from 'react-json-tree'
import ReactMarkdown from 'react-markdown'
import './Preview.css'

class Preview extends Component {

  _render() {
    const {parsedObject, language, text} = this.props

    if (!language.id || !text || !parsedObject)
      return <div className="No-preview">No preview</div>

    switch (language.id) {
      case 'oas':
      case 'raml':
        return <ReactConsole raml={parsedObject}/>
      case 'md':
        return <ReactMarkdown source={text}/>
      default:
        return <JSONTree data={parsedObject} hideRoot={true}/>
    }
  }

  render() {
    return <div className="Preview">{this._render()}</div>
  }
}

const mapStateToProps = state => {
  const {editor} = state
  return {
    text: editor.text,
    parsedObject: editor.parsedObject,
    language: editor.language
  }
}

export default connect(mapStateToProps)(Preview)
