// @flow

import React, {Component} from 'react'
import {connect} from 'react-redux'
import cx from 'classnames'
import {goToError} from './actions'
import {getErrors} from "./../editor/selectors"
import {getCurrentFilePath} from '../editor/selectors'
import type {Dispatch} from '../../types'
import type {Issue} from './types'
import './Errors.css'
import Path from "../../repository/Path";

type Props = {
  errors: Issue[],
  onErrorClick: (error: Issue) => any,
  currentPath: Path
}

type State = {
  filterErrors: boolean,
  filterWarnings: boolean
}

class Errors extends Component {

  state: State
  props: Props

  constructor(props) {
    super(props)

    this.state = {
      filterErrors: false,
      filterWarnings: false
    }
  }

  _renderFilters(issues: Issue[]) {
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

  _filterIssues(filter: string) {
    const isError = filter === 'error'
    this.setState(isError ? {filterErrors: !this.state.filterErrors} : {filterWarnings: !this.state.filterWarnings})
  }

  _filterRootErrors(error: Issue) {
    const {filterErrors, filterWarnings} = this.state
    return (!error.isWarning && !filterErrors) || (error.isWarning && !filterWarnings)
  }

  _renderErrors(errors: Issue[], trace: boolean = false) {
    const currentPath = this.props.currentPath
    return errors.map((error, index) => {
      const traceFileName = error.path !== currentPath.last() ? error.path : ''
      return (
        <li key={`error${index}`} className={error.isWarning ? 'warning' : 'error'}>
          {trace ? <span> ↳ </span> : null}
          <a onClick={this.props.onErrorClick.bind(this, error)} data-test-id={`Error-${index}`}>
            {error.message} at <strong>{`${traceFileName} (${error.startLineNumber}, ${error.startColumn})`}</strong>
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
    const errors: Issue[] = this.props.errors
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

const mapStateToProps = (state: any) => {
  return {
    errors: getErrors(state),
    currentPath: getCurrentFilePath(state)
  }
}

const mapDispatch = (dispatch: Dispatch) => {
  return {
    onErrorClick: (error: Issue) => dispatch(goToError(error))
  }
}

export default connect(mapStateToProps, mapDispatch)(Errors)