//@flow
import React, {Component} from 'react'
import {connect} from 'react-redux'

class Errors extends Component {

  render() {
    const {errors} = this.props
    return (
      <pre>
        {JSON.stringify(errors, null, 2)}
      </pre>
    )
  }
}

const mapStateToProps = state => {
  const {parse} = state
  return {
    errors: parse.errors
  }
}

export default connect(mapStateToProps)(Errors)