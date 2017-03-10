import React, {Component} from 'react'
import {connect} from 'react-redux'
import cx from 'classnames'
import {goToError} from './actions'
import {getErrors} from "./../editor/selectors"
import './Errors.css'

class Errors extends Component {

  constructor(props) {
    super(props)

    this.state = {
      filterErrors: false,
      filterWarnings: false,
    }
  }

  _renderFilters(issues) {
    const warnings = issues.filter(error => error.isWarning).length
    const errors = issues.length - warnings

    return (
      <div className="Filter">
        {errors > 0 ?
          <a className={cx('Filter-errors', { 'toggled': this.state.filterErrors })}
             data-test-id="Errors-Tab"
             onClick={this._filterIssues.bind(this, 'error')}>
            <strong className="Counter">{errors}</strong> {errors === 1 ? 'Error' : 'Errors'}
          </a> : null
        }
        <a className={cx('Filter-warnings', { 'toggled': this.state.filterWarnings })}
           data-test-id="Warning-Tab"
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

  _filterRootErrors(error) {
    const {filterErrors, filterWarnings} = this.state
    return (!error.isWarning && !filterErrors) || (error.isWarning && !filterWarnings)
  }

  _renderErrors(errors, trace = false) {
    return errors.map((error, index) => {
      return (
        <li key={`error${index}`} className={error.isWarning ? 'warning' : 'error'}>
          {trace ? <span> ↳ </span> : null}
          <a onClick={this.props.onErrorClick.bind(this, error)} data-test-id={`Error-${index}`}>
            {error.message} <strong>({error.startLineNumber}, {error.startColumn})</strong>
          </a>
          {!(error.trace && error.trace.length > 0) ? null :
            <ol className="Trace-errors">
              {this._renderErrors(error.trace, true)}
            </ol>}
        </li>
      )
    })
  }

  render() {
    const {errors} = this.props
    if (!errors || errors.length === 0)
      return <div className="Errors No-errors" data-test-id="No-Errors">No errors</div>

    const filteredErrors = errors.filter(error => this._filterRootErrors(error))

    return (
      <div className="Errors" data-test-id="Errors-Panel">
        {this._renderFilters(errors)}
        <ol className="Root-errors">
          {this._renderErrors(filteredErrors)}
        </ol>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    errors: getErrors(state)
  }
}

const mapDispatch = dispatch => {
  return {
    onErrorClick: error => dispatch(goToError(error))
  }
}

export default connect(mapStateToProps, mapDispatch)(Errors)