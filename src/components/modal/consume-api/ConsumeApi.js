// @flow

import React, {Component} from 'react'
import {connect} from 'react-redux'
import Button from '@mulesoft/anypoint-components/lib/Button'
import Modal from '@mulesoft/anypoint-components/lib/Modal'
import ModalHeader from '@mulesoft/anypoint-components/lib/ModalHeader'
import ModalBody from '@mulesoft/anypoint-components/lib/ModalBody'
import ModalFooter from '@mulesoft/anypoint-components/lib/ModalFooter'
import Search from '@mulesoft/anypoint-components/lib/Search'
import Spinner from '@mulesoft/anypoint-components/lib/Spinner'
import Toast from '@mulesoft/anypoint-components/lib/Toast'
import consumeIndex from './index'
import {List} from 'immutable'
import {Fragment} from './Fragment'
import './ConsumeApi.css'
import FragmentComponent from './FragmentComponent'

class ConsumeApi extends Component {

  onSearchChange(event) {
    this.props.updateQuery(event.value)
  }

  handleFragmentSelection(index, fragment, event) {
    this.props.handleFragmentSelection(index, fragment, event.value)
  }

  handleSearchFragment(query) {
    this.props.searchFragment(query)
  }

  renderFragments(fragments: List<Fragment>) {
    return fragments.map((fragment: Fragment, index) => {
      return <FragmentComponent isOdd={index % 2 !== 0}
                                key={`fragment${index}`}
                                fragment={fragment}
                                handleFragmentSelection={this.handleFragmentSelection.bind(this, index, fragment)}/>
    })
  }

  render() {
    const {onCancel, fragments, query, submit, isSearching, isSubmitting, error, closeError, onMock, isMock} = this.props
    const numSelectedFragments = fragments.count(fragment => fragment.selected)

    return (
      <Modal testId="Consume-Modal"
             onEsc={onCancel}
             onClickOverlay={onCancel}
             className="consume-api-modal">
        <ModalHeader onClose={onCancel}>
          <h2>Consume API Fragment</h2>
        </ModalHeader>
        {error.length > 0 ?
          <div className="error-zone">
            <Toast title={error} kind="error" onClose={closeError} testId="Consume-Error"/>
          </div> : null}
        <ModalBody className="consume-api-body">
          <div className="search-panel">
            <Search onSearch={this.handleSearchFragment.bind(this, query)}
                    onChange={this.onSearchChange.bind(this)}
                    className="consume-api-searcher"
                    query={query}
                    placeholder="Search for fragments"
                    id="consume-search"
                    testId="Consume-Search"/>
          </div>
          <div className="consume-api-content" data-test-id="Consume-Content">
            {isSearching ?
              <div className="search-spinner"><Spinner size="l"/></div> :
              fragments.size > 0 ?
                this.renderFragments(fragments) :
                null
            }
          </div>
        </ModalBody>
        <ModalFooter className="search-footer">
          <div className="modal-mocked-zone">
            <Button kind="tertiary" noFill onClick={onMock.bind(this, !isMock)} testId="Mock-Consume-Button">
              {`${isMock ? 'Unmock': 'Mock'} Fragments`}
            </Button>
          </div>
          <div className="modal-button-zone">
            <Button kind="tertiary" noFill onClick={onCancel} testId="Cancel-Consume-Button">Cancel</Button>
            <Button kind="primary"
                    isLoading={isSubmitting}
                    disabled={numSelectedFragments === 0}
                    onClick={submit.bind(this, fragments)}
                    testId="Submit-Consume-Button">
              {isSubmitting ?
                'Submitting...'
                : `Add ${numSelectedFragments !== 0 ? numSelectedFragments : ''} Dependenc${numSelectedFragments > 1 ? 'ies' : 'y'}`
              }
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    )
  }
}

const mapStateToProps = state => {
  const {consumeApi} = state
  return {
    fragments: consumeApi.fragments,
    query: consumeApi.query,
    isSearching: consumeApi.isSearching,
    error: consumeApi.error,
    isSubmitting: consumeApi.isSubmitting,
    isMock: consumeApi.isMock
  }
}

const mapDispatchToProps = dispatch => {
  return {
    searchFragment: (query: string) => dispatch(consumeIndex.actions.searchFragments(query)),
    handleFragmentSelection: (index: number, fragment: Fragment, selected: boolean) =>
      dispatch(consumeIndex.actions.handleFragmentSelection(index, fragment, selected)),
    updateQuery: (query: string) => dispatch(consumeIndex.actions.updateQuery(query)),
    submit: (fragments: List<Fragment>) => dispatch(consumeIndex.actions.submit(fragments)),
    closeError: () => dispatch(consumeIndex.actions.showError('')),
    onMock: (isMock: boolean) => dispatch(consumeIndex.actions.onMock(isMock))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConsumeApi)