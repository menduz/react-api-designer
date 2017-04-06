// @flow

import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '../../MulesoftComponents'
import * as actions from './actions'
import {
  getMessage,
  getTitle,
  isOpen
} from './selectors'
import './MessageModal.css'
import type {Dispatch} from '../../../types'

type Props = {
  isOpen: boolean,
  message: string,
  title: string,
  onCancel: () => void
}

class MessageModal extends Component {
  props: Props

  render() {
    const { isOpen, message, title, onCancel} = this.props

    return !isOpen ? (
      <div/>
    ) : (
      <Modal testId="Message-Modal"
             onEsc={onCancel}
             onClickOverlay={onCancel}
             className="message-modal">
        <ModalHeader onClose={onCancel}>
          <h1>{title}</h1>
        </ModalHeader>
        <ModalBody className="message-body">
          <div>
            {message}
          </div>
        </ModalBody>
        <ModalFooter className="message-footer">
          <div className="modal-button-zone">
            <Button kind="tertiary" noFill onClick={onCancel} testId="Close-Message-Button">Close</Button>
          </div>
        </ModalFooter>
      </Modal>
    )
  }
}

const mapStateToProps = (rootState: any): $Shape<Props> => {
  return {
    isOpen: isOpen(rootState),
    message: getMessage(rootState),
    title: getTitle(rootState)
  }
}

const mapDispatchToProps = (dispatch: Dispatch): $Shape<Props> => {
  return { onCancel: () => dispatch(actions.clear())}
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageModal)
