//@flow
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {ReactConsole} from '../console'
import JSONTree from 'react-json-tree'
import ReactMarkdown from 'react-markdown'
import './Preview.css'

class Preview extends Component {

  render() {
    const {parsedObject, language, text} = this.props

    if (!parsedObject || !language.id) return <div className="Preview No-preview">No preview</div>

    switch (language.id) {
      case 'oas':
      case 'raml':
        return <ReactConsole raml={parsedObject}/>
      case 'md':
        return <ReactMarkdown source={text}/>
      default:
        return <JSONTree data={parsedObject} theme={{base00:'#000000'}} hideRoot={true}/>
    }
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
