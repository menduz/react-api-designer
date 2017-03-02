import React, {Component} from 'react'
import {connect} from 'react-redux'

import Toast from '@mulesoft/anypoint-components/lib/Toast'
import {removeToast} from './actions'

import './Toasts.css'

class Toasts extends Component {
  render() {
    const {toasts, onClose} = this.props

    var allToasts = toasts.map((toast, index) =>
      <Toast className="Toast"
             key={index+toast.date}
             title={toast.msg}
             kind={toast.kind}
             onClose={onClose.bind(this, toast.msg)}
             testId="Toast"
             closable />
    );

    return (
      <div>
        {allToasts}
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {toasts} = state
  return {
    toasts: toasts.toasts
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onClose: (toastTitle: string) => dispatch(removeToast(toastTitle))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Toasts)
