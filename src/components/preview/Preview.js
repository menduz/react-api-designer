//@flow
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {ReactConsole} from '../console'
import JSONTree from 'react-json-tree'

class Preview extends Component {

  render() {
    const {parsedObject, mimeType} = this.props

    if (!parsedObject) return <ReactConsole raml={parsedObject}/>

    switch (mimeType) {
      case 'text/raml':
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
    mimeType: parse.mimeType
  }
}

export default connect(mapStateToProps)(Preview)
