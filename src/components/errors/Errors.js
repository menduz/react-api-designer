//@flow
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {cursorJump} from '../../actions'
import './errors.css'

class Errors extends Component {

  _renderItems(errors) {
    return errors.map((error, index) => {
        return(
          <li key={index}>
            <a onClick={this.props.onErrorClick.bind(this, error)}>
              {`${error.message} (${error.startLineNumber}, ${error.startColumn})`}
            </a>
          </li>
        )
    })
  }

  render() {
    const {errors} = this.props
    return (
      <ol>
        {this._renderItems(errors)}
      </ol>
    )
  }
}

const mapStateToProps = state => {
  const {parse} = state
  return {
    errors: parse.errors
  }
}

const mapDispatch = dispatch => {
  return {
    onErrorClick: error => dispatch(cursorJump(error.startLineNumber, error.startColumn))
  }
}

export default connect(mapStateToProps, mapDispatch)(Errors)