//@flow
import React, {Component} from 'react'
import {connect} from 'react-redux'
import EmptyResult from '@mulesoft/anypoint-components/lib/EmptyResult'
import {ReactConsole} from '../console'
import JSONTree from 'react-json-tree'

class Preview extends Component {

  render() {
    const {parsedObject, language} = this.props
    switch (language) {
      case 'raml':
        return <ReactConsole raml={parsedObject}/>
      default:
        return <JSONTree data={parsedObject} theme={{base00:'#000000'}} hideRoot={true}/>
    }
  }
}

const mapStateToProps = state => {
  const {editor} = state
  return {
    parsedObject: editor.parsedObject,
    language: editor.language
  }
}

export default connect(mapStateToProps)(Preview)
