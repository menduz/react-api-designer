// @flow

import React, {Component} from 'react'
import {connect} from 'react-redux'

import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Toast, Spinner} from '../../MulesoftComponents'
import {isSearching, getError, getFragment, canUpdate, getCurrentGAV} from './DependencySelectors'
import {showError, clear, updateDependency} from './DependencyActions'
import DependencyInfo from './DependencyInfo'

import type {Dispatch} from '../../../types'
import type {Fragment} from '../consume-api/Fragment'
import type {GAV} from './DependencyModel'

import './Dependency.css'
import {removeDependency} from '../../dependencies-tree/actions'

class DependencyModal extends Component {
  props: DependencyProps

  _renderFragmentProperties() {
    const {fragment, canUpdate, currentGAV} = this.props
    return (
      <div className="dependency-answer">
        <DependencyInfo fragment={fragment} canUpdate={canUpdate} currentGAV={currentGAV}/>
      </div>
    )
  }

  render() {
    const {
      isSearching, error, onCancel, closeError, currentGAV,
      updateDependency, canUpdate, fragment, removeDependency
    } = this.props
    return (
      <Modal testId="Dependency-Modal"
             onEsc={onCancel}
             onClickOverlay={onCancel}
             className="dependency-modal">
        <ModalHeader onClose={onCancel}>
          <h1 className="modal-title">{fragment ? fragment.name : 'Loading'}</h1>
        </ModalHeader>
        {error.length > 0 ?
          <div className="error-zone">
            <Toast title={error} kind="error" onClose={closeError} testId="Dependency-Error"/>
          </div> : null}
        <ModalBody className="dependency-body">
          <div className="dependency-content" data-test-id="Dependency-Content">
            {isSearching ?
              <div className="search-spinner"><Spinner size="l"/></div> :
              this._renderFragmentProperties()
            }
          </div>
        </ModalBody>
        {isSearching ? null :
          <ModalFooter className="search-footer">
            <div className="modal-button-zone">
              <Button kind="danger"
                      onClick={removeDependency.bind(this, currentGAV)}
                      testId="Remove-Dependency-Button">
                Remove
              </Button>
              {canUpdate ?
                <Button kind="primary"
                        onClick={updateDependency}
                        testId="Update-Dependency-Button">
                  {`Update to ${fragment.version}`}
                </Button> : null}
              <Button kind="tertiary" noFill onClick={onCancel} testId="Cancel-Dependency-Button">Cancel</Button>
            </div>
          </ModalFooter>
        }
      </Modal>
    )
  }
}

type DependencyProps = {
  isSearching: boolean,
  error: string,
  canUpdate: boolean,
  currentVersion: string,
  fragment: $Shape<Fragment>,
  currentGAV: GAV,
  closeError: () => void,
  onCancel: () => void,
  updateDependency: () => void,
  removeDependency: (gav: GAV) => void
}

const mapStateToProps = (state: any) => {
  return {
    isSearching: isSearching(state),
    canUpdate: canUpdate(state),
    error: getError(state),
    currentGAV: getCurrentGAV(state),
    currentVersion: getError(state),
    fragment: getFragment(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    closeError: () => dispatch(showError('')),
    onCancel: () => dispatch(clear()),
    removeDependency: (gav: GAV) => {
      dispatch(removeDependency(gav))
      dispatch(clear())
    },
    updateDependency: () => dispatch(updateDependency())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DependencyModal)
