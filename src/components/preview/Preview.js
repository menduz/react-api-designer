//@flow
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {ReactConsole} from '../console'
import JSONTree from 'react-json-tree'

class Preview extends Component {

  render() {
    const {parsedObject, language} = this.props
    if (!parsedObject) return <ReactConsole raml={{}}/>

    switch (language) {
      case 'raml':
        return <ReactConsole raml={parsedObject}/>
      default:
        return <JSONTree data={parsedObject} theme={{base00:'#000000'}} hideRoot={true}/>
    }
  }
}

const mapStateToProps = state => {
  const {parse} = state
  return {
    parsedObject: parse.parsedObject,
    language: parse.language
  }
}

export default connect(mapStateToProps)(Preview)
