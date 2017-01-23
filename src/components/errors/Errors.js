//@flow
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {setPosition} from '../editor/actions'
import './Errors.css'

class Errors extends Component {

  _renderFilters(issues) {
    let errors = 0
    let warnings = 0
    for (let issue of issues) {
      if (issue.severity === 'warning') warnings++
      else errors++
    }

    return (
      <div className="Filter">
        <a href="#"><strong>{errors}</strong> {errors === 1 ? 'Error' : 'Errors'}</a>
        <a href="#"><strong>{warnings}</strong> {warnings === 1 ? 'Warning' : 'Warnings'}</a>
      </div>
    )
  }

  _renderItems(errors) {
    return errors.map((error, index) => {
      return (
        <li key={index} className={error.severity}>
          <a onClick={this.props.onErrorClick.bind(this, error)}>
            {error.message} <strong>({error.startLineNumber}, {error.startColumn})</strong>
          </a>
        </li>
      )
    })
  }

  render() {
    const {errors} = this.props
    if (!errors || errors.length === 0)
      return <div className="Errors No-errors">No errors</div>

    return (
      <div className="Errors">
        {this._renderFilters(errors)}
        <ol>
          {this._renderItems(errors)}
        </ol>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {editor} = state
  return {
    errors: editor.errors
  }
}

const mapDispatch = dispatch => {
  return {
    onErrorClick: error => dispatch(setPosition(error.startLineNumber, error.startColumn))
  }
}

export default connect(mapStateToProps, mapDispatch)(Errors)