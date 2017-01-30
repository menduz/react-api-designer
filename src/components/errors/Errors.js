//@flow
import React, {Component} from 'react'
import {connect} from 'react-redux'
import cx from 'classnames'
import './Errors.css'
import {goToError} from './actions'

class Errors extends Component {

  constructor(props) {
    super(props)

    this.state = {
      filterErrors: false,
      filterWarnings: false,
    }
  }

  _renderFilters(issues) {
    let errors = 0
    let warnings = 0
    for (let issue of issues) {
      if (issue.isWarning) warnings++
      else errors++
    }

    return (
      <div className="Filter">
        <a className={cx('Filter-errors', { 'toggled': this.state.filterErrors })} href="#"
           onClick={this._filterIssues.bind(this, 'error')}>
          <strong className="Counter">{errors}</strong> {errors === 1 ? 'Error' : 'Errors'}
        </a>
        <a className={cx('Filter-warnings', { 'toggled': this.state.filterWarnings })} href="#"
           onClick={this._filterIssues.bind(this, 'warning')}>
          <strong className="Counter">{warnings}</strong> {warnings === 1 ? 'Warning' : 'Warnings'}
        </a>
      </div>
    )
  }

  _filterIssues(filter) {
    const isError = filter === 'error'
    this.setState(isError ? {filterErrors: !this.state.filterErrors} : {filterWarnings: !this.state.filterWarnings})
  }

  _filterRootErrors(error, trace) {
    const {filterErrors, filterWarnings} = this.state
    return !trace ? (!error.isWarning && !filterErrors) || (error.isWarning && !filterWarnings) : true
  }

  _renderItems(errors, trace = false) {
    const {onErrorClick} = this.props

    return errors.filter(error => {
      return this._filterRootErrors(error, trace)
    }).map((error, index) => {
      return (
        <li key={index} className={error.isWarning ? 'warning' : 'error'}>
          {trace ? <span> ↳ </span> : null}
          <a onClick={onErrorClick.bind(this, error)}>
            {error.message} <strong>({error.startLineNumber}, {error.startColumn})</strong>
          </a>
          {!(error.trace && error.trace.length > 0) ? null :
            <ol className="Trace-errors">
              {this._renderItems(error.trace, true)}
            </ol>}
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
        <ol className="Root-errors">
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
    onErrorClick: error => dispatch(goToError(error))
  }
}

export default connect(mapStateToProps, mapDispatch)(Errors)